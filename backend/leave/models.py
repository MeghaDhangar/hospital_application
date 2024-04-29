from django.db import models
from doctor.models import Doctor
import uuid

# Create your models here.
class Leave(models.Model):
    leave_id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    start_time = models.TimeField()
    end_time = models.TimeField()
    date = models.DateField()
    leave_description = models.TextField(blank=True)
    created_by = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_by = models.CharField(max_length=255)
    updated_at = models.DateTimeField(auto_now = True)