from rest_framework import serializers
from employee.models import Employee


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        exclude = ('employee_type',)

class EmployeeRelation(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['employee_id', 'employee_name']

class EmployeeUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'