from django.urls import path
from employee.views import EmployeeAdd, EmployeeView, EmployeeViewById, EmployeeUpdate, EmployeeDelete

urlpatterns= [
    path('add', EmployeeAdd.as_view(), name='employee add'),
    path('view/', EmployeeView.as_view(), name = 'employee view'),
    path('view/<uuid:input>/', EmployeeViewById.as_view(), name = 'employee view by id'),
    path('update/<uuid:input>', EmployeeUpdate.as_view(), name = 'employee update'),
    path('delete/<uuid:input>', EmployeeDelete.as_view(), name = 'employee delete'),
]