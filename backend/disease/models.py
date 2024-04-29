from django.db import models
import uuid

# Create your models here.
class Disease(models.Model):
    disease_id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)
    disease_name = models.CharField(max_length = 255)
    disease_status = models.BooleanField(default = False)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.CharField(max_length = 255)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.CharField(max_length = 255)
    