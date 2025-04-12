# -*- coding: utf-8 -*-
from flask import Blueprint, request, jsonify, render_template, send_file, current_app
import os

from flask_mail import Message
from app.db import insert_company, check_existing_company_by_inn, check_existing_company_by_name


application_bp = Blueprint('application', __name__)

@application_bp.before_app_request
def before_request():
    global MAIL_RECIPIENT
    MAIL_RECIPIENT = current_app.config['MAIL_RECIPIENT']

@application_bp.route("/application")
def application():
    return render_template("applications.html")


@application_bp.route("/application/new")
def add_application():
    return render_template("addapplications.html")


@application_bp.route('/download')
def download_file():
    path_to_file = os.path.join(os.getcwd(), 'static/forms/ФормаЗаявления.pdf')
    return send_file(path_to_file, as_attachment=True)


@application_bp.route("/application/new/applicaton-software")
def companysoftware_application():
    return render_template("addPO.html")


@application_bp.route('/submit-application', methods=['POST'])
def info_company():
    data = request.get_json()
    company_name = data.get('companyName', '')
    phone = data.get('phoneNumber', '')
    company_type = data.get('type', '')
    inn = data.get('inn', '')

    try:
        existing_company = check_existing_company_by_name(company_name)
        if existing_company:
            return jsonify({"success": False, "message": "Компания с таким именем уже существует."})
        
        existing_company = check_existing_company_by_inn(inn)
        if existing_company:
            return jsonify({"success": False, "message": "Компания с таким ИНН уже существует."})

        company_id = insert_company(data)

        email_message = f"Компания: {company_name}\n\nСообщение:\nЗаявка о включении сведений компании в области разработки {company_type}\n\n\n\nТел.: {phone}"

        subject = 'Новое уведомление'

        msg = Message(subject,
                      recipients=[MAIL_RECIPIENT],
                      body=email_message)

        mail = current_app.extensions['mail']
        mail.send(msg)

        return jsonify({"success": True, "message": "Заявка успешно отправлена!"})

    except Exception  as e:
        print(f"Ошибка при вставке данных: {e}")
        return jsonify({"success": False, "message": "Ошибка при отправке заявки."})


@application_bp.route("/application/new/applicaton-hardware")
def companthardware_application():
    return render_template("addPAK.html")


@application_bp.route("/application/update") # ЗАЯВЛЕНИЕ НА ИЗМЕНЕНИЕ
def update_application():
    return render_template("changes.html")


@application_bp.route('/submit-application-update', methods=['POST'])
def send_messageUpdate():
    data = request.get_json()
    company_name = data.get('companyName')
    message = data.get('message')
    phone = data.get('phoneNumber')

    email_message = f"Компания: {company_name}\n\nСообщение:\n{message}\n\n\n\nТел.: {phone}"

    try:
        subject = 'Новое уведомление'

        msg = Message(subject,
                      recipients=[MAIL_RECIPIENT],
                      body=email_message)

        mail = current_app.extensions['mail']
        mail.send(msg)

        return jsonify({"success": True, "message": "Заявка успешно отправлена!"})

    except Exception as e:
        print("Ошибка при отправке письма:", e)
        return jsonify({"success": False, "message": "Произошла ошибка при отправке данных."}), 500


@application_bp.route("/application/delete") # ЗАЯВЛЕНИЕ НА УДАЛЕНИЕ
def delete_application():
    return render_template("exclude.html")


@application_bp.route('/submit-application-delete', methods=['POST'])
def send_messageDelete():
    data = request.get_json()
    company_name = data.get('companyName')
    message = data.get('message')
    phone = data.get('phoneNumber')

    email_message = f"Компания: {company_name}\n\nСообщение:\n{message}\n\n\n\nТел.: {phone}"

    try:
        subject = 'Новое уведомление'

        msg = Message(subject,
                      recipients=[MAIL_RECIPIENT],
                      body=email_message)

        mail = current_app.extensions['mail']
        mail.send(msg)

        return jsonify({"success": True, "message": "Заявка успешно отправлена!"})

    except Exception as e:
        print("Ошибка при отправке письма:", e)
        return jsonify({"success": False, "message": "Произошла ошибка при отправке данных."}), 500