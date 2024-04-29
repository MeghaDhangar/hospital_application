# auth0_integration/urls.py

from django.urls import path
from .views import validate_auth0_token, get_auth0_user_profile

urlpatterns = [
    path('validate-auth0-token/', validate_auth0_token, name='validate_auth0_token'),
    path('get-auth0-user-profile/', get_auth0_user_profile, name='get_auth0_user_profile'),
]
    # Add more paths as needed
