from django.db import models
import uuid
from django.core.validators import RegexValidator
from django.contrib.auth.hashers import make_password


class Employee(models.Model):
    employee_id =  models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee_name=  models.CharField(max_length=100)
    employee_email = models.EmailField(max_length=100)
    employee_number = models.BigIntegerField()
    employee_password = models.CharField(max_length=255)
    employee_type = models.CharField(max_length=50,  choices=(('Part Time', 'Part Time'),
                                                              ('Full Time', 'Full Time')))
    employee_role =  models.CharField(max_length=50, choices=(('Doctor','Doctor'),
                                                              ('Manager','Manager')))
    employee_status = models.CharField(max_length=50, choices=(('Available','Available'),
                                                               ('Unavailable', 'Unavailable')))
    created_at = models.DateTimeField(auto_now_add=True,)
    created_by = models.CharField(max_length=100, default="Default_value")
    updated_at = models.DateTimeField(auto_now=True,)
    updated_by =  models.CharField(max_length=100, default="default_value")




    def save(self, *args, **kwargs):
        # Hash the password before saving
        self.employee_password = make_password(self.employee_password)
        super(Employee, self).save(*args, **kwargs)