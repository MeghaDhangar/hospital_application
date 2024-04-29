from rest_framework import serializers
from disease.models import Disease


class DiseaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Disease
        exclude = ('created_by', 'updated_by')


class DiseaseRelation(serializers.ModelSerializer):
    class Meta:
        model = Disease
        exclude = ('created_by', 'updated_by', 'created_at', 'updated_at')


class DiseaseAppointmentRelation(serializers.ModelSerializer):
    class Meta:
        model = Disease
        fields = ['disease_name']
