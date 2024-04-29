from django.test import TestCase
from django.test import TestCase
from rest_framework.test import APITestCase
from django.urls import reverse
import pdb
import uuid
from checkup.serializers import CheckupSerializer
from checkup.models import CheckUp
from datetime import date , datetime

ddate = date.today()
now = datetime.now() 
time  = now.strftime("%H:%M:%S")
class TestSetUp(APITestCase):
    def setUp(self):
        self.checkup_add = reverse('checkup add')
        self.checkup_view = reverse('checkup view')

        self.test = uuid.uuid4()
        self.checkup_view_url = reverse(
            'checkup view by id', kwargs={'input': self.test})
        self.checkup_delete_url = reverse(
            'checkup delete', kwargs={'input': self.test})
        self.checkup_update_url = reverse(
            'checkup update', kwargs={'input': self.test})
        self.checkup_data = {
            "check_status":"test",
            "next_appointment_date":ddate,
            "next_appointment_time":time
        }
        return super().setUp()

    def tearDown(self):
        return super().tearDown()


class Testview(TestSetUp):
    def test_checkup_can_add(self):
        res = self.client.post(self.checkup_add,self.checkup_data,format='json')
        self.assertEqual(res.status_code, 200)

    def test_checkup_cannot_add(self):
        res = self.client.post(self.checkup_add)
        self.assertEqual(res.status_code, 400)

    def test_checkup_view(self):
        res = self.client.get(self.checkup_view)
        self.assertEqual(res.status_code, 200)

    def test_checkup_cannot_view(self):
        res = self.client.post(self.checkup_view)
        self.assertEqual(res.status_code, 405)

    def test_checkup_view_by_id(self):
        res = self.client.get(self.checkup_view_url, input=self.test)
        self.assertEqual(res.status_code, 200)

    def test_checkup_cannot_view_by_id(self):
        res = self.client.post(self.checkup_view_url, input=75421)
        self.assertEqual(res.status_code, 405)

    def test_checkup_update_(self):
        res = self.client.patch(self.checkup_update_url, input=self.test)
        self.assertEqual(res.status_code, 200)

    def test_checkup_cannot_update_(self):
        res = self.client.post(self.checkup_update_url,input=85874984)
        self.assertEqual(res.status_code, 405)

    def test_checkup_delete(self):
        res = self.client.delete(self.checkup_delete_url, input=self.test)
        self.assertEqual(res.status_code, 200)
    def test_checkup_cannot_delete(self):
        res = self.client.post(self.checkup_delete_url, input=self.test)
        self.assertEqual(res.status_code, 405)

class CheckupSerializerTest(TestCase):
     def test_serializer(self):
      self.checkup_data = {
            "check_status":"test",
            "next_appointment_date":ddate,
            "next_appointment_time":time
        }
      serializer = CheckupSerializer(data=self.checkup_data)
      self.assertTrue(serializer.is_valid())
      self.assertEqual(serializer.errors, {})


class TestCheckupModel(TestCase):
    def test_model(self):
        check_status = "test"
        checkup = CheckUp.objects.create(check_status=check_status)
        self.assertEqual(check_status, checkup.check_status)

    
