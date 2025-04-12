import os
from dotenv import load_dotenv

load_dotenv()  # Загружаем данные из .env файла

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'a2f6d29e9b21c5f3b42a0539b4176f4f')
    MAIL_SERVER = 'mail.hosting.reg.ru'
    MAIL_PORT = 465
    MAIL_USE_SSL = True
    MAIL_USERNAME = 'info@digi-map.ru'
    MAIL_PASSWORD = 'qQ3vU2rR3awT1mH3'
    MAIL_DEFAULT_SENDER = 'info@digi-map.ru'
    MAIL_RECIPIENT = os.getenv('MAIL_RECIPIENT')

    #БД
    DB_HOST = os.getenv('DB_HOST')
    DB_PORT = os.getenv('DB_PORT')
    DB_USER = os.getenv('DB_USER')
    DB_PASSWORD = os.getenv('DB_PASSWORD')
    DB_NAME = os.getenv('DB_NAME')

    #ПАРСЕР
    API_KEY = os.getenv('API_KEY', 'a9f900439663e569726c8e975c06ae80')
    BASE_URL = os.getenv('BASE_URL', 'http://api.scraperapi.com')

    #ЕСИА
    GOSUSLUGI_AUTH_URL = os.getenv("GOSUSLUGI_AUTH_URL", "https://esia-portal1.test.gosuslugi.ru/aas/oauth2/ac")
    # GOSUSLUGI_AUTH_URL = "https://esia.gosuslugi.ru/aas/oauth2/ac"
    CLIENT_ID = os.getenv("GOSUSLUGI_CLIENT_ID", "DIGIMAP")
    REDIRECT_URI = os.getenv("GOSUSLUGI_REDIRECT_URI", "https://digi-map.ru/")
    THUMBPRINT = os.getenv("PRIVATE_KEY_THUMBPRINT")
