from django.urls import path, include
from error.views import ErrorRegister

urlpatterns = [
    path('register/', ErrorRegister.as_view()),
]