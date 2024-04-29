from django.urls import path
from appointment.views import *


urlpatterns = [
    path('add/', AppointmentAdd.as_view(), name = 'appointment add'),
    path('view/', AppointmentView.as_view(), name = 'appointment view'),
    path('view/<uuid:input>/', AppointmentViewById.as_view(), name = 'appointment view by id'),
    path('update/<uuid:input>/', AppointmentUpdate.as_view(), name = 'appointment update'),
    path('delete/<uuid:input>/', AppointmentDelete.as_view(), name = 'appointment delete'),
    path('appointmentCount/', AppointmentCount.as_view(), name="Appointment Count"),
    path('tab/<uuid:input>/', AppointmentTab.as_view(), name = 'appointmentTab')
]