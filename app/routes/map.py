from flask import Blueprint, request, jsonify, render_template, url_for, session, redirect
from app.db import get_active_records_count_map, get_companies_by_filter_region, get_region_info, get_companies_by_filter_pak, get_companies_by_filter_po, get_region_name_by_abb, get_companies_count_by_region_and_type, get_company_info_by_id, get_company_icons_by_id
from user_agents import parse

map_bp = Blueprint('map', __name__)

@map_bp.route("/check_token")
def check():
    token = session.get('access_token')
    return token if token else None

@map_bp.route("/logout/map", methods=["POST"])
def logout():
    session.clear()
    return redirect("/map")

@map_bp.route("/map", methods=['POST', 'GET'])
def get_active_records_count_by_filter():
    check_auth = check()
    filter = "ПО"

    # Получаем информацию о user-agent
    user_agent = parse(request.headers.get('User-Agent'))

    # Определяем, мобильное ли это устройство
    is_mobile = user_agent.is_mobile

    if request.method == "POST":
        button_id = request.form["active_button"]
        if button_id == "ButtonPAK":
            filter = "ПАК"
        
        active_records_count = get_active_records_count_map(filter)
        return jsonify({'active_records_count': active_records_count})
    else:
        active_records_count = get_active_records_count_map(filter)
        
        # Если мобильное устройство, рендерим index2.html, иначе index.html
        if is_mobile:
            return render_template("index2.html", active_records_count=active_records_count, check_auth=check_auth)
        else:
            return render_template("index.html", active_records_count=active_records_count, check_auth=check_auth)
      
@map_bp.route("/filterRegion", methods=['POST'])
def get_companies_by_region(): # ФИЛЬТРОВАНИЕ ТОЛЬКО ПО РЕГИОНУ
    data = request.get_json()
    print(data)
    region = data.get('regionName')
    type_company = data.get('activeButtonId')

    if type_company == 'ButtonPO':
        type_company = 'ПО'
        companies = get_companies_by_filter_region(type_company, region)
        
    else:
        type_company = 'ПАК'
        companies = get_companies_by_filter_region(type_company, region)

    companies_list = [{'id': id, 'company_name': name, 'position_company': position, 'address': address, 'region': region, 'logo_company': logo_url} 
                          for id, type, name, position, address, region, logo_url in companies]  

    return jsonify({'companies': companies_list})


@map_bp.route("/filterPAK", methods=['POST', 'GET'])  # ФИЛЬТРИРОВАНИЕ ПО КОМПАНИЯМ ПАК
def get_companies_by_pak():
    type_company = 'ПАК'

    if request.method == "POST":
        data = request.get_json()
        regions = data.get('regions') or []
        hardwareclasses = data.get('hardwareclasses') or []
        fields = data.get('fields') or []
        errp = data.get('errp')

        companies = get_companies_by_filter_pak(type_company, regions, hardwareclasses, fields, errp)

        companies_list = [{'id': id, 'company_name': name, 'position_company': position, 'address': address, 'region': region, 'logo_company': logo_url} 
                          for id, name, position, address, region, logo_url in companies]

        info = get_region_info(regions, companies_list)

        return jsonify({'companies': companies_list, 'region': info})
    

@map_bp.route("/filterPO", methods=['POST', 'GET'])  # ФИЛЬТРИРОВАНИЕ ПО КОМПАНИЯМ ПАК
def get_companies_by_po():
    type_company = 'ПО'

    if request.method == "POST":
        data = request.get_json()
        regions = data.get('regions') or []
        softwareclasses = data.get('softwareclasses') or []
        fields = data.get('fields') or []
        errp = data.get('errp')
        ai = data.get('software_ai')

        companies = get_companies_by_filter_po(type_company, regions, softwareclasses, fields, errp, ai)

        companies_list = [{'id': id, 'company_name': name, 'position_company': position, 'address': address, 'region': region, 'logo_company': logo_url} 
                          for id, name, position, address, region, logo_url in companies]

        info = get_region_info(regions, companies_list)

        return jsonify({'companies': companies_list, 'region': info})
    
@map_bp.route('/region/<id>', methods=['GET'])  # ИНФОРМАЦИЯ ПО РЕГИОНУ
def region(id):
    activeButtonId = request.args.get('button')
    ai = request.args.get('software_ai')
    errp = request.args.get('errp')
    if activeButtonId == 'ButtonPAK':
        type_company = 'ПАК'
    else:
        type_company = 'ПО'

    region_name = get_region_name_by_abb(id)

    if region_name:
        countCompany = get_companies_count_by_region_and_type(region_name, type_company, errp, ai)
        info = {
            'name': region_name,
            'count': countCompany
        }
    else:
        info = {
            'name': None,
            'count': 0
        }

    return jsonify(info)

@map_bp.route("/info", methods=['POST', 'GET'])  # ВЫВОД ИНФОРМАЦИИ ПО КОМПАНИИ
def about_company():
    if request.method == "POST":
        data = request.get_json()
        id = data.get('idCompany')

        # Получаем информацию о компании из базы данных
        company = get_company_info_by_id(id)

        # Проверяем, что компания найдена
        if company:
            DEFAULT_IMAGES = {
                'video': url_for('static', filename='images/default/video.mp4'),
                'second': url_for('static', filename='images/default/second.jpg'),
                'third': url_for('static', filename='images/default/third.jpg'),
                'fourth': url_for('static', filename='images/default/fourth.jpg'),
            }

            company_info = [{
                'id': company[0],
                'company_name': company[1],
                'position_company': company[2],
                'description': company[3],
                'product': company[4],
                'service': company[5],
                'address': f'{company[11]}, {company[12]}',
                'contact': company[13],
                'video': company[6] or DEFAULT_IMAGES['video'],
                'main_logo_image': company[7],
                'second_image': company[8] or DEFAULT_IMAGES['second'],
                'third_image': company[9] or DEFAULT_IMAGES['third'],
                'fourth_image': company[10] or DEFAULT_IMAGES['fourth'],
            }]

            return jsonify(company_info)
        else:
            return jsonify({"error": "Company not found"}), 404

        
@map_bp.route("/icon/<int:id>", methods=['GET'])  # ВЫВОД ИКОНОК
def icon_contact(id):
    # Получаем иконки компании по ID
    company = get_company_icons_by_id(id)
    print(company)

    if company:
        icon = {
            'telegram': company[1],
            'vk': company[2],
            'rutube': company[3],
            'dzen': company[4],
            'site': company[5]
        }
        return jsonify(icon)
    else:
        return jsonify({"error": "Company not found"}), 404