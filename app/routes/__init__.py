from .home import home_bp
from .application import application_bp
from .region_contacts import region_contacts_bp
from .privacy_policy import privacy_policy_bp
from .map import map_bp
from .admin import admin_bp
from .auth import auth_bp

__all__ = [
    'home_bp', 
    'admin_bp',
    'application_bp',
    'region_contacts_bp',
    'privacy_policy_bp'
    'map_bp',
    'auth_bp'
]
