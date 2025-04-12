from flask import Blueprint, render_template, request, jsonify, redirect, url_for, session
from werkzeug.security import check_password_hash
from app.db import info_admin, select_new_companies, select_companies, info_company, info_new_company, delete_new_company, update_info_new_company, delete_company, update_info_company, approve_new_company

admin_bp = Blueprint('admin', __name__)

# Функция для проверки авторизации
def is_authenticated():
    return 'authenticated' in session and session['authenticated']

@admin_bp.route("/admin/login", methods=["GET"])
def login():
    return render_template("admin.html")

@admin_bp.route("/admin/login", methods=["POST"])
def login_post():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        user = info_admin(email)
        
        if user:
            # Прямое сравнение паролей
            if user['password'] == password:
                session['authenticated'] = True
                return jsonify(success=True)
            else:
                return jsonify(success=False, message="Неверный пароль"), 401
        else:
            return jsonify(success=False, message="Пользователь не найден"), 404
    except Exception as e:
        print(f"Ошибка: {e}")  # Логирование ошибки
        return jsonify(success=False, message="Произошла ошибка при обработке запроса"), 500

@admin_bp.route("/admin")
def admin_panel():
    if not is_authenticated():  # Проверка, авторизован ли пользователь
        return redirect(url_for('admin.login'))  # Перенаправляем на страницу логина
    
    companies = select_companies()
    new_companies = select_new_companies()
    return render_template('adminpanel.html', companies=companies, new_companies=new_companies)

@admin_bp.route("/logout")
def logout():
    session.pop('authenticated', None)  # Удаляем флаг авторизации
    return redirect(url_for('admin.login'))

@admin_bp.route('/get_Companies', methods=['GET'])
def get_Companies():
    try:
        companies = select_companies()
        return jsonify(companies)
    except Exception as e:
        return jsonify({'error': 'Ошибка сервера'}), 500

@admin_bp.route('/get_newCompanies', methods=['GET'])
def get_newCompanies():
    try:
        companies = select_new_companies()
        return jsonify(companies)
    except Exception as e:
        return jsonify({'error': 'Ошибка сервера'}), 500

@admin_bp.route('/search_Company', methods=['POST'])
def search_Company():
    data = request.get_json()
    company_name = data['company_name']
    attribute = data['attribute']

    result = info_company(company_name, attribute)

    if result:
        return jsonify(result)
    else:
        return jsonify({"result": None})
    
@admin_bp.route('/delete_Company', methods=['POST'])
def delete_Company():
    data = request.get_json()
    company_name = data.get('company_name')

    if not company_name:
        return jsonify({"error": "Название компании не передано"}), 400

    success = delete_company(company_name)

    if success:
        return jsonify({"message": "Компания успешно удалена!"}), 200
    else:
        return jsonify({"error": "Компания не найдена"}), 404
    

@admin_bp.route('/update_Company', methods=['POST'])
def update_Company():
    data = request.get_json()

    if not data:
        return jsonify({"success": False, "error": "Нет данных для обновления"}), 400
    success = update_info_company(data)

    if success:
        return jsonify({"success": True}), 200
    else:
        return jsonify({"success": False, "error": "Ошибка при обновлении данных"}), 500
    

@admin_bp.route('/search_newCompany', methods=['POST'])
def search_newCompany():
    data = request.get_json()

    company_name = data['company_name']
    attribute = data.get('attribute')

    result = info_new_company(company_name, attribute)

    if result:
        return jsonify(result)
    else:
        return jsonify({"result": None})


@admin_bp.route('/update_newCompany', methods=['POST'])
def update_newCompany():
    data = request.get_json()

    if not data:
        return jsonify({"success": False, "error": "Нет данных для обновления"}), 400
    success = update_info_new_company(data)

    if success:
        return jsonify({"success": True}), 200
    else:
        return jsonify({"success": False, "error": "Ошибка при обновлении данных"}), 500


@admin_bp.route('/delete_newCompany', methods=['POST'])
def delete_newCompany():
    data = request.get_json()
    company_name = data.get('company_name')

    if not company_name:
        return jsonify({"error": "Название компании не передано"}), 400

    success = delete_new_company(company_name)

    if success:
        return jsonify({"message": "Компания успешно удалена!"}), 200
    else:
        return jsonify({"error": "Компания не найдена"}), 404
   
    
@admin_bp.route('/approve_newCompany', methods=['POST'])
def approve_newCompany():
    data = request.get_json()
    company_name = data.get('company_name')

    if not company_name:
        return jsonify({"error": "Название компании не передано"}), 400

    # Вызываем функцию для одобрения компании и переноса её данных
    result = approve_new_company(company_name)

    if result["success"]:
        return jsonify({"message": result["message"]}), 200
    else:
        return jsonify({"error": result["error"]}), 400