import uuid
from django.db import models
from disease.models import Disease
from prescription.models import Prescription
from patient.models import Patient
from doctor.models import Doctor
from appointment.models import Appointment


# Checkup Model Class
class CheckUp(models.Model):
    checkup_id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False)
    doctor = models.ForeignKey(
        Doctor, default=uuid.uuid4, on_delete=models.CASCADE)
    patient = models.ForeignKey(
        Patient, default=uuid.uuid4, on_delete=models.CASCADE)
    appointment = models.ForeignKey(
        Appointment, default=uuid.uuid4, on_delete=models.CASCADE)
    disease = models.ForeignKey(
        Disease, default=uuid.uuid4, on_delete=models.CASCADE)
    prescription = models.ForeignKey(
        Prescription, default=uuid.uuid4, on_delete=models.CASCADE)
    check_status = models.BooleanField(default=False)
    next_appointment_date = models.DateField()
    next_appointment_time = models.TimeField()
    created_at = models.DateTimeField(auto_now_add=True)
