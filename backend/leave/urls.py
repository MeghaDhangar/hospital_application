from django.urls import path
from leave.views import *


urlpatterns = [
    path('add/', LeaveRegister.as_view(), name = 'leave add'),
    path('view/', LeaveView.as_view(), name = 'leave profile view'),
    path('view/<uuid:input>', LeaveViewById.as_view(), name = 'leave profile view by id'),
    path('update/<uuid:input>', LeaveUpdate.as_view(), name = 'leave profile update'),
    path('delete/<uuid:input>', LeaveDelete.as_view(), name = 'leave profile delete'),
]