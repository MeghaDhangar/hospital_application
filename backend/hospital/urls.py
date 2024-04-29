from django.contrib import admin
from django.urls import path
from hospital.views import *


urlpatterns = [
    path('register', HospitalRegister.as_view(), name = 'hospital'),
    path('view/', HospitalView.as_view(), name = 'hospital view'),
    path('view/<uuid:input>/', HospitalView.as_view(), name = 'hospital view by id'),
    path('update/<uuid:input>', HospitalUpdate.as_view(), name = 'hospital update'),
    path('delete/<uuid:input>', HospitalDelete.as_view(), name = 'hospital delete'),
]