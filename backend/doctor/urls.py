from django.urls import path
from doctor.views import *


urlpatterns = [
    path('register/', DoctorRegister.as_view(), name = 'doctor register'),
    path('view/', DoctorView.as_view(), name = 'doctor profile view'),
    path('view/<uuid:input>/', DoctorViewById.as_view(), name = 'doctor profile view by id'),
    path('update/<uuid:input>/', DoctorUpdate.as_view(), name = 'doctor profile update'),
    path('delete/<uuid:input>/', DoctorDelete.as_view(), name = 'doctor profile delete'),
]