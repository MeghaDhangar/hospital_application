from django.test import TestCase

from django.test import RequestFactory, TestCase
from rest_framework.test import APITestCase
from django.urls import reverse
import pdb
import uuid
from patient.models import Patient
from patient.serializers import PatientSerializer


class TestSetUp(APITestCase):

    def setUp(self):
        self.patient_register = reverse('patient register')

        self.patient_view = reverse('patient profile view')
        self.test = uuid.uuid4()
        self.patient_view_url = reverse(
            'patient profile view by id', kwargs={'input': self.test})
        self.patient_update_url = reverse(
            'patient profile update', kwargs={'input': self.test})
        self.patient_delete_url = reverse(
            'patient profile delete', kwargs={'input': self.test})

        self.patient_data = {
            "patient_name": "test",
            "patient_age": 56,
            "patient_address": "test",
            "patient_email": "test@gmail.com",
            "password": "test",
            "patient_mobile": 46546,

        }

        return super().setUp()

    def tearDown(self):
        return super().tearDown()


class Testview(TestSetUp):
    def test_patient_can_register(self):
        res = self.client.post(self.patient_register,self.patient_data, format='json')
        
        self.assertEqual(res.status_code, 200)

    def test_patient_cannot_register(self):
        res = self.client.post(self.patient_register)

        self.assertEqual(res.status_code, 400)

    def test_patient_can_view(self):
        res = self.client.get(self.patient_view)
        self.assertEqual(res.status_code, 200)

    def test_patient_cannot_view(self):
        res = self.client.post(self.patient_view)
        self.assertEqual(res.status_code, 405)

    def test_patient_view_by_id(self):
        res = self.client.get(self.patient_view_url, input=self.test)
        self.assertEqual(res.status_code, 200)

    def test_patient_cannot_view_by_id(self):
        res = self.client.post(self.patient_view_url)
        self.assertEqual(res.status_code, 405)

    def test_patient_can_delete(self):
        res = self.client.delete(self.patient_delete_url, input=self.test)
        self.assertEqual(res.status_code, 200)

    def test_patient_cannot_delete_(self):
        res = self.client.post(self.patient_delete_url, input=uuid.uuid4())
        self.assertEqual(res.status_code, 405)

    def test_patient_update_(self):
        res = self.client.patch(self.patient_update_url, input=self.test)
        self.assertEqual(res.status_code, 200)

    def test_patient_update_(self):
        res = self.client.post(self.patient_update_url)
        self.assertEqual(res.status_code, 405)


class TestPatientSerializer(TestCase):
    def test_patient_serializer(self):
        self.patient_data = {
            "patient_name": "test",
            "patient_age": 56,
            "patient_address": "test",
            "patient_email": "test@gmail.com",
            "patient_mobile": 46546,
            "password": "test"
        }
        serializer = PatientSerializer(data=self.patient_data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.errors, {})


class PatientModelTestCase(TestCase):
    def test_model(self):
        patient_name = 'patient'
        patient_address = 'test'
        patient_email = 'test@example.com'
        password = 'test'

        patient = Patient.objects.create(
            patient_name=patient_name, patient_address=patient_address, patient_email=patient_email, password=password)

        self.assertEqual(patient_name, patient.patient_name)
        self.assertEqual(patient_address, patient.patient_address)
        self.assertEqual(patient_email, patient.patient_email)
        self.assertEqual(password, patient.password)
