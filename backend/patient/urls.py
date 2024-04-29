from django.urls import path, include
from patient.views import *


urlpatterns = [
    path('register', PatientRegister.as_view(), name = 'patient register'),
    path('view/', PatientView.as_view(), name = 'patient profile view'),
    path('view/<uuid:input>/', PatientViewById.as_view(), name = 'patient profile view by id'),
    path('update/<uuid:input>', PatientUpdate.as_view(), name = 'patient profile update'),
    path('delete/<uuid:input>', PatientDelete.as_view(), name = 'patient profile delete'),
]