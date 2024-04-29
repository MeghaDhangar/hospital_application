from django.test import TestCase
from django.test import TestCase
from rest_framework.test import APITestCase
from django.urls import reverse
import pdb
import uuid
from doctor.serializers import DoctorSerializer
from doctor.models import Doctor
from datetime import date , datetime



ddate = date.today()
now = datetime.now() 
time  = now.strftime("%H:%M:%S")

class TestSetUp(APITestCase):
    def setUp(self):
        self.doctor_add = reverse('doctor register')
        self.doctor_view = reverse('doctor profile view')

        self.test = uuid.uuid4()
        self.doctor_view_url = reverse(
            'doctor profile view by id', kwargs={'input': self.test})
        self.doctor_delete_url = reverse(
            'doctor profile delete', kwargs={'input': self.test})
        self.doctor_update_url = reverse(
            'doctor profile update', kwargs={'input': self.test})
        self.doctor_data = {
            "doctor_profile_picture" :"test url",
            "disease_specialist":"[\"Asthma\", \"Common cold\"]",
            "times":"[[\"09:00:00\", \"12:00:00\"], [\"02:00:00\", \"05:00:00\"], [\"07:00:00\", \"10:00:00\"]]",
            "day":"[\"Monday\", \"Tuesday\", \"Wednesday\", \"Thursday\", \"Friday\", \"Saturday\"]",
            "per_patient_time":time,
            "status":"test"
            
            
        }
        return super().setUp()

    def tearDown(self):
        return super().tearDown()


class Testview(TestSetUp):
    def test_doctor_can_add(self):
        res = self.client.post(self.doctor_add,self.doctor_data,format='json')
        self.assertEqual(res.status_code, 400)

    def test_doctor_cannot_add(self):
        res = self.client.post(self.doctor_add)
        self.assertEqual(res.status_code, 400)

    def test_doctor_view(self):
        res = self.client.get(self.doctor_view)
        self.assertEqual(res.status_code, 200)

    def test_doctor_cannot_view(self):
        res = self.client.post(self.doctor_view)
        self.assertEqual(res.status_code, 405)

    def test_doctor_view_by_id(self):
        res = self.client.get(self.doctor_view_url, input=self.test)
        self.assertEqual(res.status_code, 200)

    def test_doctor_cannot_view_by_id(self):
        res = self.client.post(self.doctor_view_url, input=75421)
        self.assertEqual(res.status_code, 405)

    def test_doctor_update_(self):
        res = self.client.patch(self.doctor_update_url, input=self.test)
        self.assertEqual(res.status_code, 200)

    def test_doctor_can_update_(self):
        res = self.client.post(self.doctor_update_url,input=85874984)
        self.assertEqual(res.status_code, 405)

    def test_doctor_delete(self):
        res = self.client.delete(self.doctor_delete_url, input=self.test)
        self.assertEqual(res.status_code, 200)
    def test_doctor_cannot_delete(self):
        res = self.client.post(self.doctor_delete_url, input=self.test)
        self.assertEqual(res.status_code, 405)




class TestDoctorModel(TestCase):
    def test_model(self):
       doctor_profile_picture = "testing url"
       disease_specialist = "test"
       times = "test"
       day = "test"
       per_patient_time = time
       status = "test"

      

       doctor = Doctor.objects.create(doctor_profile_picture=doctor_profile_picture,disease_specialist=disease_specialist,times=times,day=day,per_patient_time=per_patient_time,status=status)
       self.assertEqual(disease_specialist, doctor.disease_specialist)
       self.assertEqual(times,doctor.times)
       self.assertEqual(day,doctor.day)
       self.assertEqual(per_patient_time,doctor.per_patient_time)
       self.assertEqual(status,doctor.status)
       
    


      


