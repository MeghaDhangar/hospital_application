from django.urls import path
from disease.views import *


urlpatterns = [
    path('add', DiseaseAdd.as_view(), name = 'disease add'),
    path('view/', DiseaseView.as_view(), name = 'disease view'),
    path('view/<uuid:input>/', DiseaseView.as_view(), name = 'disease view by id'),
    path('update/<uuid:input>', DiseaseUpdate.as_view(), name = 'disease update'),
    path('delete/<uuid:input>', DiseaseDelete.as_view(), name = 'disease delete'),
]