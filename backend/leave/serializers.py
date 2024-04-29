from rest_framework import serializers
from leave.models import Leave


class LeaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leave
        fields = '__all__'
