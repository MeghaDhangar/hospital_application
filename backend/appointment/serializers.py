from rest_framework import serializers
from appointment.models import Appointment
from doctor.serializers import DoctorAppointmentRelation
from patient.serializers import PatientAppointmentRelation
from disease.serializers import DiseaseAppointmentRelation

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'


class AppointmentAddSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'


class AppointmentViewSerializer(serializers.ModelSerializer):
    doctor = DoctorAppointmentRelation()
    patient = PatientAppointmentRelation()
    disease = DiseaseAppointmentRelation()

    class Meta:
        model = Appointment
        fields = ['appointment_id', 'appointment_number',
                  'appointment_time', 'appointment_date', 'doctor', 'patient','checked', 'disease', 'created_at']
