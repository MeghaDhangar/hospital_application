from django.db import models
from appointment.models import Appointment
import uuid


# Prescription View Class
class Prescription(models.Model):
    prescription_id  = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)
    appointment =  models.ForeignKey(Appointment, default = uuid.uuid4, on_delete = models.CASCADE)
    prescription_photo = models.CharField(max_length = 255)
    medication_name = models.CharField(max_length = 255)
    dosage = models.CharField(max_length = 10)
    frequency = models.CharField(max_length = 50)
    route = models.CharField(max_length = 50, choices=(('Tablet', 'Tablet'),
                                                     ('Oral','Oral'),
                                                     ('Intravenous', 'Intravenous'),
                                                     ('Intramuscular','Intramuscular'),
                                                     ('Subcutaneous','Subcutaneous'),
                                                     ('Topical','Topical'),
                                                     ('Inhalation', 'Inhalation')))
    duration = models.CharField(max_length = 50)
    created_at = models.DateTimeField(auto_now_add = True,)
    # created_by = models.CharField(max_length=100, default="default_value")
    update_at = models.DateTimeField(auto_now = True,)
    # upadte_by = models.CharField(max_length=100,default="default_value")
    
