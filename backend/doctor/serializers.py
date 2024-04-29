from rest_framework import serializers
from doctor.models import Doctor
from employee.serializers import EmployeeRelation


class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        exclude = ('doctor_profile_picture',)


class DoctorUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        exclude = ('employee', )


class DoctorViewSerializer(serializers.ModelSerializer):
    employee = EmployeeRelation()

    class Meta:
        model = Doctor
        fields = ['doctor_id', 'disease_specialist', 'doctor_profile_picture', 'times',
                  'day', 'per_patient_time', 'status', 'created_at', 'updated_at', 'employee']


class DoctorRelation(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        exclude = ('created_at', 'updated_at', )


class DoctorAppointmentRelation(serializers.ModelSerializer):
    employee = EmployeeRelation()

    class Meta:
        model = Doctor
        fields = ['doctor_id', 'doctor_profile_picture', 'employee']
