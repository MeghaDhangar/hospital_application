from django.test import TestCase
from django.test import TestCase
from rest_framework.test import APITestCase
from django.urls import reverse
import pdb
import uuid
from appointment.serializers import AppointmentSerializer
from appointment.models import Appointment
from datetime import date , datetime



ddate = date.today()
now = datetime.now() 
time  = now.strftime("%H:%M:%S")
class TestSetUp(APITestCase):
    def setUp(self):
        self.appointment_add = reverse('appointment add')
        self.appointment_view = reverse('appointment view')

        self.test = uuid.uuid4()
        self.appointment_view_url = reverse(
            'appointment view by id', kwargs={'input': self.test})
        self.appointment_delete_url = reverse(
            'appointment delete', kwargs={'input': self.test})
        self.appointment_update_url = reverse(
            'appointment update', kwargs={'input': self.test})
       
      

        self.appointment_data = {
              "appointment": 45,
              "appointment_time":time,
              "appointment_date":ddate
             
        }
        return super().setUp()

    def tearDown(self):
        return super().tearDown()


class Testview(TestSetUp):
    def test_appointment_can_add(self):
        res = self.client.post(self.appointment_add,self.appointment_data,format='json')
        self.assertEqual(res.status_code, 400)

    def test_appointment_cannot_add(self):
        res = self.client.post(self.appointment_add)
        self.assertEqual(res.status_code, 400)

    def test_appointment_view(self):
        res = self.client.get(self.appointment_view)
        self.assertEqual(res.status_code, 200)

    def test_appointment_cannot_view(self):
        res = self.client.post(self.appointment_view)
        self.assertEqual(res.status_code, 405)

    def test_appointment_view_by_id(self):
        res = self.client.get(self.appointment_view_url, input=self.test)
        self.assertEqual(res.status_code, 200)

    def test_appointment_cannot_view_by_id(self):
        res = self.client.post(self.appointment_view_url, input=75421)
        self.assertEqual(res.status_code, 405)

    def test_appointment_update_(self):
        res = self.client.patch(self.appointment_update_url, input=self.test)
        self.assertEqual(res.status_code, 200)

    def test_appointment_cannot_update_(self):
        res = self.client.post(self.appointment_update_url,input=85874984)
        self.assertEqual(res.status_code, 405)

    def test_appointment_delete(self):
        res = self.client.delete(self.appointment_delete_url, input=self.test)
        self.assertEqual(res.status_code, 200)
    def test_appointment_cannot_delete(self):
        res = self.client.post(self.appointment_delete_url, input=self.test)
        self.assertEqual(res.status_code, 405)



class TestappointmentModel(TestCase):
    def test_model(self):
        appointment_number = 45
        appointment_time = time
        appointment_date = ddate
        appointment = Appointment.objects.create(appointment_number = appointment_number,appointment_time=appointment_time,appointment_date=appointment_date)
        self.assertEqual(appointment_number,appointment.appointment_number)
        self.assertEqual(appointment_time,appointment.appointment_time)
        self.assertEqual(appointment_date,appointment.appointment_date)
        
