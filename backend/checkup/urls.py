from django.urls import path
from checkup.views import *


urlpatterns= [
    path('add/', CheckUpAdd.as_view(), name='checkup add'),
    path('view/',CheckUpView.as_view(), name = 'checkup view'),
    path('view/<uuid:input>/', CheckUpViewById.as_view(), name = 'checkup view by id'),
    path('delete/<uuid:input>/', CheckUpDelete.as_view(), name = 'checkup delete'),
    path('update/<uuid:input>/', CheckUpUpdate.as_view(), name = 'checkup update')
]