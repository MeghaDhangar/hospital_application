from django.test import TestCase
from django.test import TestCase
from rest_framework.test import APITestCase
from django.urls import reverse
import pdb
import uuid
from prescription.serializer import PrescriptionSerializer
from prescription.models import Prescription
from datetime import datetime

now = datetime.now() 

class TestSetUp(APITestCase):
    def setUp(self):
        self.prescription_add = reverse('prescription add')
        self.prescription_view = reverse('prescription view')

        self.test = uuid.uuid4()
        self.prescription_view_url = reverse(
            'prescription view by id', kwargs={'input': self.test})
        self.prescription_delete_url = reverse(
            'prescription delete', kwargs={'input': self.test})
        self.prescription_update_url = reverse(
            'prescription update', kwargs={'input': self.test})
        self.prescription_data = {
            "prescription_photo":"image test"
           
        }
        return super().setUp()

    def tearDown(self):
        return super().tearDown()


class Testview(TestSetUp):
    def test_prescription_cannot_add(self):
        res = self.client.post(self.prescription_add)
        self.assertEqual(res.status_code, 400)

    def test_prescription_can_add(self):
        res = self.client.post(self.prescription_add,
                               self.prescription_data, format='json')
        self.assertEqual(res.status_code, 200)

    def test_user_view(self):
        res = self.client.get(self.prescription_view, )
        self.assertEqual(res.status_code, 200)

    def test_user_cannot_view(self):
        res = self.client.post(self.prescription_view)
        self.assertEqual(res.status_code, 405)

    def test_prescription_view_by_id(self):
        res = self.client.get(self.prescription_view_url, input=self.test)
        self.assertEqual(res.status_code, 200)

    def test_user_cannot_view_by_id(self):
        res = self.client.get(self.prescription_view_url, input=uuid.uuid4())
        self.assertEqual(res.status_code, 200)

    def test_prescription_update_(self):
        res = self.client.patch(self.prescription_update_url, input=self.test)
        self.assertEqual(res.status_code, 200)

    def test_user_prescription_update_(self):
        res = self.client.patch(self.prescription_update_url)
        self.assertEqual(res.status_code, 200)

    def test_prescription_delete(self):
        res = self.client.delete(self.prescription_delete_url, input=self.test)
        self.assertEqual(res.status_code, 200)


class PrecriptionSerializerTest(TestCase):
    def test_serializer(self):
        self.prescription_data = {
           "prescription_photo":"image test"
          
        }

        serializer = PrescriptionSerializer(data=self.prescription_data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.errors, {})


class TestPrescriptionModel(TestCase):
    def test_model(self):
        prescription_photo  = 'image test'
     

        prescription = Prescription.objects.create(prescription_photo=prescription_photo)
        self.assertEqual(prescription_photo,prescription.prescription_photo)
       