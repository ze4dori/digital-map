# -*- coding: utf-8 -*-
from flask import Flask
from flask_mail import Mail, Message
from flask_cors import CORS
from flask import current_app
from .routes import home_bp, application_bp, region_contacts_bp, privacy_policy_bp, map_bp, admin_bp, auth_bp

def create_app():
    application = Flask(__name__)
    application.secret_key = 'a2f6d29e9b21c5f3b42a0539b4176f4f'
    application.config.from_object('config.Config')

    application.config['MAIL_SERVER'] = 'mail.hosting.reg.ru'
    application.config['MAIL_PORT'] = 465
    application.config['MAIL_USE_SSL'] = True
    application.config['MAIL_USERNAME'] = 'info@digi-map.ru'
    application.config['MAIL_PASSWORD'] = 'qQ3vU2rR3awT1mH3'
    application.config['MAIL_DEFAULT_SENDER'] = 'info@digi-map.ru'

    mail = Mail(application)
    

    CORS(application)

    application.register_blueprint(home_bp)
    application.register_blueprint(admin_bp)
    application.register_blueprint(application_bp)
    application.register_blueprint(region_contacts_bp)
    application.register_blueprint(privacy_policy_bp)
    application.register_blueprint(map_bp)
    application.register_blueprint(auth_bp)

    return application
