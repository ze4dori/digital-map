import mysql.connector
from flask import current_app, jsonify, request

def get_db_connection():
    """Создание подключения к базе данных MySQL."""
    conn = mysql.connector.connect(
        host=current_app.config['DB_HOST'],
        user=current_app.config['DB_USER'],
        password=current_app.config['DB_PASSWORD'],
        database=current_app.config['DB_NAME']
    )
    
    return conn

def get_active_records_count():
    """Возвращает количество активных записей из таблицы Companies."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(id) FROM Companies")
    count = cursor.fetchone()[0]
    conn.close()
    return count

def get_region_contacts():
    """Возвращает список всех контактов из таблицы Region."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT name, email, phone, abb FROM Region")
    contacts = cursor.fetchall()
    conn.close()
    return contacts

def get_active_records_count_map(filter):
    """Возвращает количество активных записей из таблицы Companies по фильтру типа компании (ПАК или ПО)."""
    conn = get_db_connection()
    cursor = conn.cursor()
    # cursor.execute(f"SELECT COUNT(id) FROM Companies WHERE type = ?", (filter,))
    query = "SELECT COUNT(id) FROM Companies WHERE type = %s"
    cursor.execute(query, (filter,))
    count = cursor.fetchone()[0]
    conn.close()
    return count


def get_companies_by_filter_region(type_company, region):
    """Получение списка компаний по фильтрам."""
    conn = get_db_connection()
    cursor = conn.cursor()

    # Основной SQL-запрос с условиями для фильтрации
    query = """
    SELECT DISTINCT c.id, c.type, c.name, c.short_description, c.address, c.region, c.logo_url
    FROM Companies c
    WHERE 1=1
    """

    # Параметры для подстановки в запрос
    params = []

    # Добавляем условия фильтрации, если переданы параметры
    if type_company:
        query += " AND c.type = %s"
        params.append(type_company)

    if region:
        query += " AND c.region = %s"
        params.append(region)

    # Выполнение запроса с параметрами
    cursor.execute(query, params)
    companies = cursor.fetchall()

    conn.close()

    return companies

def get_companies_by_filter_pak(type_company, regions, hardwareclasses, fields, errp):
    """Получение списка компаний по фильтрам."""
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
    SELECT DISTINCT c.id, c.name, c.short_description, c.address, c.region, c.logo_url
    FROM Companies c
    LEFT JOIN CompanyHardware ch ON c.id = ch.company_id
    LEFT JOIN HardwareSubclasses hs ON ch.subclass_id = hs.id
    LEFT JOIN CompanyIndustries ci ON c.id = ci.company_id
    LEFT JOIN CompanyRegistry cr ON c.id = cr.company_id
    """

    conditions = []
    params = []

    # Фильтрация по типу компании
    if type_company:
        conditions.append("c.type = %s")
        params.append(type_company)

    # Фильтрация по регионам
    if regions and regions != ['Вся Россия']:
        # Создаем плейсхолдеры для каждого региона в списке
        placeholders = ', '.join(['%s'] * len(regions))
        conditions.append(f"c.region IN ({placeholders})")
        params.extend(regions)

    # Фильтрация по классам оборудования
    if hardwareclasses and hardwareclasses != ['Все']:
        hardwareclass_conditions = ' OR '.join(f"hs.name LIKE %s" for hardwareclass in hardwareclasses)
        conditions.append(f"({hardwareclass_conditions})")
        params.extend([f"%{hardwareclass}%" for hardwareclass in hardwareclasses])

    # Фильтрация по областям деятельности
    if fields and fields != ['Все']:
        field_conditions = ' OR '.join(f"ci.industry LIKE %s" for field in fields)
        conditions.append(f"({field_conditions})")
        params.extend([f"%{field}%" for field in fields])

    # Фильтрация по признаку регистрации
    if errp is not None:
        conditions.append("cr.is_in_registry = %s")
        params.append(errp)

    # Если есть фильтры, добавляем их в запрос
    if conditions:
        query += ' WHERE ' + ' AND '.join(conditions)

    cursor.execute(query, tuple(params))
    companies = cursor.fetchall()
    conn.close()

    return companies

def get_companies_by_filter_po(type_company, regions, hardwareclasses, fields, errp, ai):
    """Получение списка компаний по фильтрам."""
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
    SELECT DISTINCT c.id, c.name, c.short_description, c.address, c.region, c.logo_url
    FROM Companies c
    LEFT JOIN CompanySoftware cs ON c.id = cs.company_id
    LEFT JOIN SoftwareSubclasses hs ON cs.subclass_id = hs.id
    LEFT JOIN CompanyIndustries ci ON c.id = ci.company_id
    LEFT JOIN CompanyRegistry cr ON c.id = cr.company_id
    LEFT JOIN AI_CompanyRegistry ai_reg ON c.id = ai_reg.company_id
    """

    conditions = []
    params = []

    if type_company:
        conditions.append("c.type = %s")
        params.append(type_company)

    if regions and regions != ['Вся Россия']:
        regions_placeholder = ', '.join(['%s'] * len(regions))
        conditions.append(f"c.region IN ({regions_placeholder})")
        params.extend(regions)

    if hardwareclasses and hardwareclasses != ['Все']:
        hardwareclass_conditions = ' OR '.join(f"hs.name LIKE %s" for hardwareclass in hardwareclasses)
        conditions.append(f"({hardwareclass_conditions})")
        params.extend([f"%{hardwareclass}%" for hardwareclass in hardwareclasses])

    if fields and fields != ['Все']:
        field_conditions = ' OR '.join(f"ci.industry LIKE %s" for field in fields)
        conditions.append(f"({field_conditions})")
        params.extend([f"%{field}%" for field in fields])

    if errp is not None:
        conditions.append("cr.is_in_registry = %s")
        params.append(errp)

    if ai is not None:
        conditions.append("ai_reg.is_specializing_in_ai = %s")
        params.append(ai)

    if conditions:
        query += ' WHERE ' + ' AND '.join(conditions)

    cursor.execute(query, tuple(params))
    companies = cursor.fetchall()
    conn.close()

    return companies

def get_region_info(regions, companies):
    """Получение информации о регионах."""
    conn = get_db_connection()
    cursor = conn.cursor()

    info = []
    if regions:
        for region in regions:
            query = "SELECT abb, side FROM Region WHERE name = %s"
            cursor.execute(query, (region,))
            region_data = cursor.fetchone()
            if region_data:
                info.append({'abb': region_data[0], 'side': region_data[1]})
            else:
                info.append({'abb': None, 'side': None})
    else:
        unique_regions = set(company['region'] for company in companies)
        for region in unique_regions:
            query = "SELECT abb, side FROM Region WHERE name = %s"
            cursor.execute(query, (region,))
            region_data = cursor.fetchone()
            if region_data:
                info.append({'abb': region_data[0], 'side': region_data[1]})
            else:
                info.append({'abb': None, 'side': None})

    conn.close()

    return info

def get_region_name_by_abb(region_abb):
    """Получить название региона по его аббревиатуре."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM Region WHERE abb = %s", (region_abb,))
    region_name = cursor.fetchone()
    conn.close()

    return region_name[0] if region_name else None

def get_companies_count_by_region_and_type(region, type_company, errp=None, ai=None):
    """Подсчитать количество компаний по региону и типу компании с дополнительными фильтрами."""
    conn = get_db_connection()
    cursor = conn.cursor()

    if type_company == 'ПАК':
        query = """
        SELECT COUNT(DISTINCT c.id)
        FROM Companies c
        LEFT JOIN CompanyHardware ch ON c.id = ch.company_id
        LEFT JOIN HardwareSubclasses hs ON ch.subclass_id = hs.id
        LEFT JOIN CompanyIndustries ci ON c.id = ci.company_id
        LEFT JOIN CompanyRegistry cr ON c.id = cr.company_id
        WHERE c.region = %s AND c.type = %s
        """
    else:  # ПО
        query = """
        SELECT COUNT(DISTINCT c.id)
        FROM Companies c
        LEFT JOIN CompanySoftware ch ON c.id = ch.company_id
        LEFT JOIN SoftwareSubclasses sf ON ch.subclass_id = sf.id
        LEFT JOIN CompanyIndustries ci ON c.id = ci.company_id
        LEFT JOIN CompanyRegistry cr ON c.id = cr.company_id
        LEFT JOIN AI_CompanyRegistry ai ON c.id = ai.company_id
        WHERE c.region = %s AND c.type = %s
        """
    
    params = [region, type_company]

    if errp is not None:
        query += " AND cr.is_in_registry = %s"
        params.append(errp)

    if type_company == 'ПО' and ai is not None:
        query += " AND ai.is_specializing_in_ai = %s"
        params.append(ai)

    cursor.execute(query, tuple(params))
    count = cursor.fetchone()[0]
    conn.close()

    return count

def get_company_info_by_id(id):
    """Получить информацию о компании по её ID."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Используем %s вместо ?
    cursor.execute("""
        SELECT id, name, short_description, full_description, products,
               services, video_url, logo_url, image1_url, image2_url, image3_url,
               region, address, phone
        FROM Companies
        WHERE id = %s""", (id,)) 
    company = cursor.fetchone()
    conn.close()

    return company

def get_company_icons_by_id(id):
    """Получить контактные данные (иконки) компании по её ID."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT id, telegram, vk, rutube, dzen, website_url
        FROM Companies
        WHERE id = %s""", (id,)) 

    company = cursor.fetchone()
    conn.close()

    return company

def check_existing_company_by_inn(inn):
    """Проверка, существует ли компания с данным ИНН в базе данных."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM NewCompanies WHERE inn = %s', (inn,))
    company = cursor.fetchone()

    if not company:
        cursor.execute('SELECT * FROM NewCompanies WHERE inn = %s', (inn,))
        company = cursor.fetchone()

    conn.close()
    
    return company

def check_existing_company_by_name(name):
    """Проверка, существует ли компания с данным имени в базе данных."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM Companies WHERE name = %s', (name,))
    company = cursor.fetchone()

    if not company:
        cursor.execute('SELECT * FROM NewCompanies WHERE name = %s', (name,))
        company = cursor.fetchone()
        
    conn.close()
    
    return company

def insert_company(data):
    """Вставка компании в таблицу NewCompanies, используя уже существующие соединение и курсор."""
    conn = get_db_connection()
    cursor = conn.cursor()

    name = data.get('companyName', '')
    inn = data.get('inn', '')
    company_type = data.get('type', '')
    short_description = data.get('companyType', '')[:255]
    full_description = data.get('companyDescription', '')
    main_logo_url = data.get('main_logo', '')
    logo_url = data.get('logo', '')
    video_url = data.get('video', '')

    products = data.get('productNames', '').replace('\n', '; ')
    services = data.get('serviceNames', '').replace('\n', '; ')
    image1_url = data.get('first_image', '')
    image2_url = data.get('second_image', '')
    image3_url = data.get('third_image', '')

    region = data.get('region', [])[0] if data.get('region') else ''
    address = data.get('address', '')
    phone = data.get('phoneNumber', '')
    telegram = data.get('telegram', '')
    vk = data.get('vk', '')
    rutube = data.get('rutube', '')
    dzen = data.get('dzen', '')
    website_url = data.get('website', '')

    is_in_registry = int(data.get('isRegistered', False))
    is_specializing_in_ai = int(data.get('isAI', False))

    softwareclasses = '; '.join(data.get('softwareclasses', [])) if data.get('softwareclasses') else ''
    hardwareclasses = '; '.join(data.get('hardwareclasses', [])) if data.get('hardwareclasses') else ''
    field = '; '.join(data.get('fields', [])) if data.get('fields') else ''

    try:
        query = '''
            INSERT INTO NewCompanies (
                name, inn, type, short_description, full_description,
                products, services, main_logo_url, logo_url, video_url,
                image1_url, image2_url, image3_url, region, address,
                phone, telegram, vk, rutube, dzen, website_url,
                is_in_registry, is_specializing_in_ai,
                softwareclasses, hardwareclasses, field
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 
                    %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 
                    %s, %s, %s, %s, %s, %s)
        '''

        cursor.execute(query, (
            name, inn, company_type, short_description, full_description, 
            products, services, main_logo_url, logo_url, video_url, 
            image1_url, image2_url, image3_url, region, address,
            phone, telegram, vk, rutube, dzen, website_url,
            is_in_registry, is_specializing_in_ai,
            softwareclasses, hardwareclasses, field
        ))

        conn.commit()

        company_id = cursor.lastrowid

        return company_id

    except mysql.connector.Error as e:
        print(f"Ошибка при вставке компании: {e}")
        conn.rollback()
        return None


# РАБОТА С АДМИН ПАНЕЛЬЮ
def info_admin(email):
    """Получение данных администратора по email для проверки входа."""

    connection = get_db_connection()

    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Admin WHERE mail = %s", (email,))

    admin_data = cursor.fetchone()

    cursor.close()
    connection.close()
    print(admin_data)

    return admin_data

def select_new_companies():
    """Получение всех новых заявлений из базы данных."""
    conn = get_db_connection()
    if conn is None:
        return []

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM NewCompanies")
    applications = cursor.fetchall()
    cursor.close()
    conn.close()

    return applications

def select_companies():
    """Получение всех заявлений из базы данных."""
    conn = get_db_connection()
    if conn is None:
        return []

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Companies")
    applications = cursor.fetchall()
    cursor.close()
    conn.close()

    return applications

def info_company(company_name, attribute=None):
    """Поиск компании в базе данных по названию и атрибуту (если атрибут передан)."""
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    attributes_mapping = {
        'Название': 'name',
        'ПО/ПАК': 'type',
        'Направление': 'short_description',
        'ИНН': 'inn',
        'Описание': 'full_description',
        'Продукты': 'products',
        'Услуги': 'services',
        'Логотип крупный': 'main_logo_url',
        'Логотип уменьшенный': 'logo_url',
        'Фото 1': 'image1_url',
        'Фото 2': 'image2_url',
        'Фото 3': 'image3_url',
        'Видео': 'video_url',
        'Регион': 'region',
        'Адресс': 'address',
        'Телефон': 'phone',
        'telegram': 'telegram',
        'vk': 'vk',
        'rutube': 'rutube',
        'Яндекс.Дзен': 'dzen',
        'Сайт': 'website_url'
    }

    reverse_mapping = {v: k for k, v in attributes_mapping.items()}

    if attribute and attribute in attributes_mapping:
        db_attribute = attributes_mapping[attribute]
        query = f"SELECT id, {db_attribute} FROM Companies WHERE name LIKE %s"
        cursor.execute(query, ('%' + company_name + '%',))
    else:
        query = "SELECT id, name FROM Companies WHERE name LIKE %s"
        cursor.execute(query, ('%' + company_name + '%',))

    result = cursor.fetchone()

    if result:
        company_id = result['id']

        cursor.execute("SELECT is_in_registry FROM CompanyRegistry WHERE company_id = %s", (company_id,))
        registry_data = cursor.fetchone()
        result['is_in_registry'] = registry_data['is_in_registry'] if registry_data else None

        cursor.execute("SELECT is_specializing_in_ai FROM AI_CompanyRegistry WHERE company_id = %s", (company_id,))
        ai_data = cursor.fetchone()
        result['is_specializing_in_ai'] = ai_data['is_specializing_in_ai'] if ai_data else None

        cursor.execute("SELECT industry FROM CompanyIndustries WHERE company_id = %s", (company_id,))
        industries = cursor.fetchall()
        result['field'] = '; '.join([industry['industry'] for industry in industries]) if industries else None

        cursor.execute("SELECT name FROM SoftwareSubclasses WHERE id IN (SELECT subclass_id FROM CompanySoftware WHERE company_id = %s)", (company_id,))
        software_classes = cursor.fetchall()
        result['softwareclasses'] = '; '.join([software_class['name'] for software_class in software_classes]) if software_classes else None

        cursor.execute("SELECT name FROM HardwareSubclasses WHERE id IN (SELECT subclass_id FROM CompanyHardware WHERE company_id = %s)", (company_id,))
        hardware_classes = cursor.fetchall()
        result['hardwareclasses'] = '; '.join([hardware_class['name'] for hardware_class in hardware_classes]) if hardware_classes else None

        result_transformed = {}
        for key, value in result.items():
            if key in reverse_mapping:
                result_transformed[reverse_mapping[key]] = value
            else:
                result_transformed[key] = value

        result = result_transformed

    cursor.close()
    conn.close()

    return result


def info_new_company(company_name, attribute=None):
    """Поиск компании в базе данных по названию и атрибуту (если атрибут передан)."""
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    attributes_mapping = {
        'Название': 'name',
        'ПО/ПАК': 'type',
        'Направление': 'short_description',
        'ИНН': 'inn',
        'Описание': 'full_description',
        'Продукты': 'products',
        'Услуги': 'services',
        'Логотип крупный': 'main_logo_url',
        'Логотип уменьшенный': 'logo_url',
        'Фото 1': 'image1_url',
        'Фото 2': 'image2_url',
        'Фото 3': 'image3_url',
        'Видео': 'video_url',
        'Регион': 'region',
        'Адресс': 'address',
        'Телефон': 'phone',
        'telegram': 'telegram',
        'vk': 'vk',
        'rutube': 'rutube',
        'Яндекс.Дзен': 'dzen',
        'Сайт': 'website_url'
    }

    reverse_mapping = {v: k for k, v in attributes_mapping.items()}

    if attribute and attribute in attributes_mapping:
        db_attribute = attributes_mapping[attribute]
        query = f"SELECT {db_attribute}, is_in_registry, is_specializing_in_ai, field, hardwareclasses, softwareclasses FROM NewCompanies WHERE name LIKE %s"
        cursor.execute(query, ('%' + company_name + '%',))
    else:
        query = "SELECT name, is_in_registry, is_specializing_in_ai, field, hardwareclasses, softwareclasses FROM NewCompanies WHERE name LIKE %s"
        cursor.execute(query, ('%' + company_name + '%',))

    result = cursor.fetchone()

    if result:
        result_transformed = {}
        for key, value in result.items():
            if key in reverse_mapping:
                result_transformed[reverse_mapping[key]] = value
            else:
                result_transformed[key] = value

        result = result_transformed

    cursor.close()
    conn.close()

    return result


def update_info_new_company(updated_data):
    """Обновление данных компании в базе данных."""
    conn = get_db_connection()
    cursor = conn.cursor()

    attributes_mapping = {
        'Название': 'name',
        'ПО/ПАК': 'type',
        'Направление': 'short_description',
        'ИНН': 'inn',
        'Описание': 'full_description',
        'Продукты': 'products',
        'Услуги': 'services',
        'Логотип крупный': 'main_logo_url',
        'Логотип уменьшенный': 'logo_url',
        'Фото 1': 'image1_url',
        'Фото 2': 'image2_url',
        'Фото 3': 'image3_url',
        'Видео': 'video_url',
        'Регион': 'region',
        'Адресс': 'address',
        'Телефон': 'phone',
        'telegram': 'telegram',
        'vk': 'vk',
        'rutube': 'rutube',
        'Яндекс.Дзен': 'dzen',
        'Сайт': 'website_url'
    }

    reverse_mapping = {v: k for k, v in attributes_mapping.items()}

    valid_columns = [
        'name', 'type', 'short_description', 'inn', 'full_description', 
        'products', 'services', 'main_logo_url', 'logo_url', 'image1_url', 
        'image2_url', 'image3_url', 'video_url', 'region', 'address', 
        'phone', 'telegram', 'vk', 'rutube', 'dzen', 'website_url', 
        'is_in_registry', 'is_specializing_in_ai', 'field', 'hardwareclasses', 
        'softwareclasses'
    ]

    update_fields = []
    values = []

    for key, value in updated_data.items():
        if key == "company_name":
            continue

        if key in attributes_mapping:
            db_column = attributes_mapping[key]
            if db_column in valid_columns:
                if value == "":
                    value = None
                update_fields.append(f"{db_column} = %s")
                values.append(value)
        elif key in valid_columns:
            if value == "":
                value = None
            update_fields.append(f"{key} = %s")
            values.append(value)

    if not update_fields:
        return {"success": False, "message": "Нет данных для обновления."}

    set_clause = ", ".join(update_fields)

    query = f"UPDATE NewCompanies SET {set_clause} WHERE name = %s"
    values.append(updated_data.get('company_name'))

    try:
        cursor.execute(query, tuple(values))
        conn.commit()

        if cursor.rowcount > 0:
            return {"success": True, "message": "Данные успешно обновлены."}
        else:
            return {"success": False, "message": "Нет изменений в данных, обновление не было выполнено."}
    except Exception as e:
        print(f"Ошибка при обновлении данных: {e}")
        return {"success": False, "message": f"Ошибка при обновлении данных: {e}"}
    finally:
        cursor.close()
        conn.close()

def update_info_company(updated_data):
    print("Полученные данные для обновления:", updated_data)
    conn = get_db_connection()

    # Используем DictCursor, чтобы получать данные в виде словаря
    cursor = conn.cursor(dictionary=True)

    try:
        conn.start_transaction()

        company_attributes_mapping = {
            'Название': 'name',
            'ПО/ПАК': 'type',
            'Направление': 'short_description',
            'ИНН': 'inn',
            'Описание': 'full_description',
            'Продукты': 'products',
            'Услуги': 'services',
            'Логотип крупный': 'main_logo_url',
            'Логотип уменьшенный': 'logo_url',
            'Фото 1': 'image1_url',
            'Фото 2': 'image2_url',
            'Фото 3': 'image3_url',
            'Видео': 'video_url',
            'Регион': 'region',
            'Адресс': 'address',
            'Телефон': 'phone',
            'telegram': 'telegram',
            'vk': 'vk',
            'rutube': 'rutube',
            'Яндекс.Дзен': 'dzen',
            'Сайт': 'website_url'
        }

        company_name = updated_data.get('company_name')
        if not company_name:
            return {"success": False, "message": "Не указано название компании."}

        # Получение ID компании
        cursor.execute("SELECT id FROM Companies WHERE name = %s", (company_name,))
        result = cursor.fetchone()

        if not result:
            return {"success": False, "message": f"Компания с названием {company_name} не найдена."}

        company_id = result['id']  # Теперь получаем id через ключ 'id'
        print(f"Найден company_id: {company_id}")

        # Формирование запроса для обновления основной таблицы
        update_fields = []
        values = []
        for key, value in updated_data.items():
            if key == "company_name":
                continue

            if value == "":
                value = None

            if key in company_attributes_mapping:
                db_column = company_attributes_mapping[key]
                update_fields.append(f"{db_column} = %s")
                values.append(value)

        if update_fields:
            set_clause = ", ".join(update_fields)
            query = f"UPDATE Companies SET {set_clause} WHERE id = %s"
            values.append(company_id)
            cursor.execute(query, tuple(values))

        # Обновление статусов
        if 'is_in_registry' in updated_data:
            registry_query = "UPDATE CompanyRegistry SET is_in_registry = %s WHERE company_id = %s"
            cursor.execute(registry_query, (updated_data.get('is_in_registry', None), company_id))

        if 'is_specializing_in_ai' in updated_data:
            ai_query = "UPDATE AI_CompanyRegistry SET is_specializing_in_ai = %s WHERE company_id = %s"
            cursor.execute(ai_query, (updated_data.get('is_specializing_in_ai', None), company_id))

        # Обновление направлений (field)
        if 'field' in updated_data:
            fields = updated_data.get('field', '').split('; ')
            cursor.execute("DELETE FROM CompanyIndustries WHERE company_id = %s", (company_id,))
            for field in fields:
                cursor.execute("INSERT INTO CompanyIndustries (company_id, industry) VALUES (%s, %s)", (company_id, field))

        # Обновление программного обеспечения (softwareclasses)
        if 'softwareclasses' in updated_data:
            software_classes = updated_data.get('softwareclasses', '').split('; ')
            cursor.execute("DELETE FROM CompanySoftware WHERE company_id = %s", (company_id,))
            for software_class in software_classes:
                cursor.execute("""
                    INSERT INTO CompanySoftware (company_id, subclass_id)
                    VALUES (%s, (SELECT id FROM SoftwareSubclasses WHERE name = %s LIMIT 1))
                """, (company_id, software_class))

        # Обновление аппаратного обеспечения (hardwareclasses)
        if 'hardwareclasses' in updated_data:
            hardware_classes = updated_data.get('hardwareclasses', '').split('; ')
            cursor.execute("DELETE FROM CompanyHardware WHERE company_id = %s", (company_id,))
            for hardware_class in hardware_classes:
                cursor.execute("""
                    INSERT INTO CompanyHardware (company_id, subclass_id)
                    VALUES (%s, (SELECT id FROM HardwareSubclasses WHERE name = %s LIMIT 1))
                """, (company_id, hardware_class))

        conn.commit()
        return {"success": True, "message": "Данные успешно обновлены."}

    except Exception as e:
        conn.rollback()
        return {"success": False, "message": f"Ошибка: {e}"}

    finally:
        cursor.close()
        conn.close()

     
def delete_new_company(company_name):
    """Удаление компании из базы данных по названию."""
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        query = "DELETE FROM NewCompanies WHERE name LIKE %s"
        cursor.execute(query, ('%' + company_name + '%',))

        conn.commit()

        if cursor.rowcount > 0:
            return True  # Удалено успешно
        else:
            return False  # Компания не найдена
    except Exception as e:
        print(f"Ошибка при удалении компании: {e}")
        return False
    finally:
        cursor.close()
        conn.close()

def delete_company(company_name):
    """Удаление компании из базы данных по названию."""
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        conn.start_transaction()

        cursor.execute("SELECT id FROM Companies WHERE name = %s", (company_name,))
        result = cursor.fetchone()

        if not result:
            return {"success": False, "message": f"Компания с названием '{company_name}' не найдена."}

        company_id = result[0]
        
        tables_to_clear = [
            ("CompanyRegistry", "company_id"),
            ("AI_CompanyRegistry", "company_id"),
            ("CompanyIndustries", "company_id"),
            ("CompanySoftware", "company_id"),
            ("CompanyHardware", "company_id"),
        ]

        for table, column in tables_to_clear:
            cursor.execute(f"DELETE FROM {table} WHERE {column} = %s", (company_id,))

        cursor.execute("DELETE FROM Companies WHERE id = %s", (company_id,))

        conn.commit()
        return {"success": True, "message": f"Компания '{company_name}' успешно удалена."}

    except Exception as e:
        conn.rollback()
        return {"success": False, "message": f"Ошибка: {e}"}

    finally:
        cursor.close()
        conn.close()

def approve_new_company(company_name):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # Получаем данные из таблицы NewCompanies
        cursor.execute('''
            SELECT * FROM NewCompanies WHERE name = %s
        ''', (company_name,))
        new_company = cursor.fetchone()

        if not new_company:
            return {"success": False, "error": "Компания не найдена в NewCompanies"}

        # Вставляем данные в таблицу Companies
        cursor.execute('''
            INSERT INTO Companies (
                name, inn, type, short_description, full_description, 
                products, services, video_url, main_logo_url, logo_url, 
                image1_url, image2_url, image3_url, region, address, phone, 
                telegram, vk, rutube, dzen, website_url
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ''', (
            new_company['name'], new_company['inn'], new_company['type'], new_company['short_description'],
            new_company['full_description'], new_company['products'], new_company['services'], 
            new_company['video_url'], new_company['main_logo_url'], new_company['logo_url'], 
            new_company['image1_url'], new_company['image2_url'], new_company['image3_url'], 
            new_company['region'], new_company['address'], new_company['phone'], 
            new_company['telegram'], new_company['vk'], new_company['rutube'], new_company['dzen'], 
            new_company['website_url']
        ))

        # Получаем ID только что вставленной компании
        company_id = cursor.lastrowid

        # Вставляем данные в таблицу CompanyRegistry
        cursor.execute('''
            INSERT INTO CompanyRegistry (company_id, is_in_registry)
            VALUES (%s, %s)
        ''', (company_id, new_company['is_in_registry']))

        # Вставляем данные в таблицу AI_CompanyRegistry
        cursor.execute('''
            INSERT INTO AI_CompanyRegistry (company_id, is_specializing_in_ai)
            VALUES (%s, %s)
        ''', (company_id, new_company['is_specializing_in_ai']))

        industries = new_company['field'].split(',')
        for industry in industries:
            cursor.execute('''
                INSERT INTO CompanyIndustries (company_id, industry)
                VALUES (%s, %s)
            ''', (company_id, industry.strip()))

        if new_company['hardwareclasses']:
            hardware_classes = [cls.strip() for cls in new_company['hardwareclasses'].split(';')]
            for hardware_class in hardware_classes:
                cursor.execute('''
                    SELECT id FROM HardwareSubclasses WHERE name = %s
                ''', (hardware_class,))
                hardware_subclass = cursor.fetchone()
                if hardware_subclass:
                    cursor.execute('''
                        INSERT INTO CompanyHardware (company_id, subclass_id)
                        VALUES (%s, %s)
                    ''', (company_id, hardware_subclass['id']))
                else:
                    print(f"[ERROR] Подкласс оборудования '{hardware_class}' не найден в таблице HardwareSubclasses.")

        if new_company['softwareclasses']:
            software_classes = [cls.strip() for cls in new_company['softwareclasses'].split(';')]  # Разделяем по ';' и удаляем пробелы
            for software_class in software_classes:
                cursor.execute('''
                    SELECT id FROM SoftwareSubclasses WHERE name = %s
                ''', (software_class,))
                software_subclass = cursor.fetchone()
                if software_subclass:
                    cursor.execute('''
                        INSERT INTO CompanySoftware (company_id, subclass_id)
                        VALUES (%s, %s)
                    ''', (company_id, software_subclass['id']))
                else:
                    print(f"[ERROR] Подкласс ПО '{software_class}' не найден в таблице SoftwareSubclasses.")


        # Удаляем компанию из таблицы NewCompanies после успешного переноса
        cursor.execute('''
            DELETE FROM NewCompanies WHERE name = %s
        ''', (company_name,))

        conn.commit()

        return {"success": True, "message": "Компания успешно добавлена в основную базу данных."}

    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}

    finally:
        cursor.close()
        conn.close()
        
# def insert_company_registry(company_id, is_registered): 
#     """Вставка записи в таблицу CompanyRegistry."""
#     conn = get_db_connection()
#     cursor = conn.cursor()

#     try:
#         cursor.execute('''
#             INSERT INTO CompanyRegistry (company_id, is_in_registry)
#             VALUES (?, ?)
#         ''', (company_id, is_registered))
        
#         conn.commit()
#     except sqlite3.Error as e:
#         print(f"Ошибка вставки в CompanyRegistry: {e}")
#     finally:
#         conn.close()

# def insert_ai_registry(company_id, is_ai):
#     """Вставка записи в таблицу AI_CompanyRegistry."""
#     if is_ai:  # Вставка только если компания занимается ИИ
#         conn = get_db_connection()
#         cursor = conn.cursor()

#         try:
#             cursor.execute('''
#                 INSERT INTO AI_CompanyRegistry (company_id, is_specializing_in_ai)
#                 VALUES (?, ?)
#             ''', (company_id, True))

#             conn.commit()
#         except sqlite3.Error as e:
#             print(f"Ошибка вставки в AI_CompanyRegistry: {e}")
#         finally:
#             conn.close()

# def insert_software_classes_and_relations(company_id, softwareclasses):
#     """Вставка программного обеспечения и связи с компанией."""
#     conn = get_db_connection()
#     cursor = conn.cursor()

#     for softwareclass in softwareclasses:
#         cursor.execute('''
#             INSERT INTO SoftwareClasses (name)
#             VALUES (?)
#         ''', (softwareclass,))
#         conn.commit()

#         subclass_id = cursor.lastrowid  # Получаем id добавленного класса программного обеспечения

#         # Связываем компанию с программным классом
#         cursor.execute('''
#             INSERT INTO CompanySoftware (company_id, subclass_id)
#             VALUES (?, ?)
#         ''', (company_id, subclass_id))
#         conn.commit()

#     conn.close()

# def insert_hardware_classes_and_relations(company_id, hardwareclasses):
#     """Вставка аппаратного обеспечения и связи с компанией."""
#     conn = get_db_connection()
#     cursor = conn.cursor()

#     for hardwareclass in hardwareclasses:
#         cursor.execute('''
#             INSERT INTO HardwareClasses (name)
#             VALUES (?)
#         ''', (hardwareclass,))
#         conn.commit()

#         hardware_subclass_id = cursor.lastrowid  # Получаем id добавленного класса аппаратного обеспечения

#         # Связываем компанию с аппаратным классом
#         cursor.execute('''
#             INSERT INTO CompanyHardware (company_id, subclass_id)
#             VALUES (?, ?)
#         ''', (company_id, hardware_subclass_id))
#         conn.commit()

#     conn.close()