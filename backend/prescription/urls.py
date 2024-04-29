from django.urls import path
from prescription.views import *


urlpatterns= [
    path('add/', PrescriptionAdd.as_view(), name='prescription add'),
    path('view/',PrescriptionView.as_view(), name = 'prescription view'),
    path('view/<uuid:input>/', PrescriptionView.as_view(), name = 'prescription view by id'),
    path('delete/<uuid:input>/', PrescriptionDelete.as_view(), name = 'prescription delete'),
    path('update/<uuid:input>/', PrescriptionUpdate.as_view(), name = 'prescription update')
]