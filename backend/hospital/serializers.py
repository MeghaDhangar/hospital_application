from rest_framework import serializers
from hospital.models import Hospital


# Hospital Serializer Class
class HospitalSerializer(serializers.ModelSerializer): 
    class Meta:
        model = Hospital
        fields = '__all__'

# Hospital Login Serializer Class
class HospitalLoginSerializer(serializers.ModelSerializer):
      class Meta:
           model = Hospital
           fields = ['username', 'password',]
        