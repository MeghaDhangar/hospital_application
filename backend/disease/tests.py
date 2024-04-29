from django.test import TestCase
from django.test import TestCase
from rest_framework.test import APITestCase
from django.urls import reverse
import pdb
import uuid
from disease.serializers import DiseaseSerializer
from disease.models import Disease

class TestSetUp(APITestCase):
    def setUp(self):
        self.disease_add = reverse('disease add')
        self.disease_view = reverse('disease view')

        self.test = uuid.uuid4()
        self.disease_view_url = reverse(
            'disease view by id', kwargs={'input': self.test})
        self.disease_delete_url = reverse(
            'disease delete', kwargs={'input': self.test})
        self.disease_update_url = reverse(
            'disease update', kwargs={'input': self.test})
        self.disease_data = {
              "disease_name":"test",
              "disease_status":"test",
            
        }
        return super().setUp()

    def tearDown(self):
        return super().tearDown()


class Testview(TestSetUp):
    def test_disease_can_add(self):
        res = self.client.post(self.disease_add,self.disease_data,format='json')
        self.assertEqual(res.status_code, 200)

    def test_disease_cannot_add(self):
        res = self.client.post(self.disease_add)
        self.assertEqual(res.status_code, 400)

    def test_disease_view(self):
        res = self.client.get(self.disease_view)
        self.assertEqual(res.status_code, 200)

    def test_disease_cannot_view(self):
        res = self.client.post(self.disease_view)
        self.assertEqual(res.status_code, 405)

    def test_disease_view_by_id(self):
        res = self.client.get(self.disease_view_url, input=self.test)
        self.assertEqual(res.status_code, 200)

    def test_disease_cannot_view_by_id(self):
        res = self.client.post(self.disease_view_url, input=75421)
        self.assertEqual(res.status_code, 405)

    def test_disease_update_(self):
        res = self.client.patch(self.disease_update_url, input=self.test)
        self.assertEqual(res.status_code, 200)

    def test_disease_cannot_update_(self):
        res = self.client.post(self.disease_update_url,input=85874984)
        self.assertEqual(res.status_code, 405)

    def test_disease_delete(self):
        res = self.client.delete(self.disease_delete_url, input=self.test)
        self.assertEqual(res.status_code, 200)
    def test_disease_cannot_delete(self):
        res = self.client.post(self.disease_delete_url, input=self.test)
        self.assertEqual(res.status_code, 405)

class DiseaseSerializerTest(TestCase):
     def test_serializer(self):
      self.disease_data = {
              "disease_name":"test",
              "disease_status":"test",
            
        }
      serializer = DiseaseSerializer(data=self.disease_data)
      self.assertTrue(serializer.is_valid())
      self.assertEqual(serializer.errors, {})


class TestDiseaseModel(TestCase):
    def test_model(self):
        disease_name = "test"
        disease_status = "test"
        disease = Disease.objects.create(disease_name=disease_name,disease_status=disease_status)
        self.assertEqual(disease_name,disease.disease_name)
        self.assertEqual(disease_status,disease.disease_status)
    
