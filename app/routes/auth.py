from flask import Blueprint, redirect, session, url_for, session

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/auth/redirect', methods=['GET'])
def gosuslugi_callback():
    """
    Псевдо-авторизация: просто возвращает фиктивный access_token.
    """
    fake_token = "fake-access-token-123456"
    session['access_token'] = fake_token
    return redirect(url_for('home.home'))