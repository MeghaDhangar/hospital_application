from django.test import RequestFactory, TestCase
from rest_framework.test import APITestCase
from django.urls import reverse
import pdb
import uuid
from hospital.models import Hospital
from hospital.serializers import HospitalSerializer, HospitalLoginSerializer


class TestSetUp(APITestCase):

    def setUp(self):
        self.hospital_register = reverse('hospital')
        self.hospital_view = reverse('hospital view')
        self.test = uuid.uuid4()
        self.hospital_view_url = reverse(
            'hospital view by id', kwargs={'input': self.test})
        self.hospital_delete_url = reverse(
            'hospital delete', kwargs={'input': self.test})
        self.hospital_update_url = reverse(
            'hospital update', kwargs={'input': self.test})

        self.hospital_data = {
            "hospital_name": "Sant Singaji Hospital",
            "hospital_email": "singaji@gmail.com",
                              "hospital_phone": '9691279019',
                              "hospital_owner_name": "Pranjal Dubey",
                              "hospital_owner_phone": "9691279018",
                              "hospital_owner_email": "admin@gmail.com",
                              "hospital_address": "Sandalpur",
                              "hospital_city": "Khategaon",
                              "hospital_status": "True",
                              "hospital_logo":"test url",
                              "hospital_type": "Private",
                              "hospital_category": "General",
                              "username": "Admin",
                              "password": "admin@123"
        }

        return super().setUp()

    def tearDown(self):
        return super().tearDown()


class Testview(TestSetUp):
    def test_hospital_can_register(self):
        res = self.client.post(self.hospital_register,
                               self.hospital_data, format='json')
        pdb.set_trace
        self.assertEqual(res.status_code, 200)

    def test_hospital_cannot_register(self):
        res = self.client.get(self.hospital_register)
        pdb.set_trace
        self.assertEqual(res.status_code, 405)

    def test_hospital_can_view(self):
        res = self.client.get(self.hospital_view)
        self.assertEqual(res.status_code, 200)

    def test_hospital_cannot_view(self):
        res = self.client.post(self.hospital_view)
        self.assertEqual(res.status_code, 405)

    def test_hospital_can_delete(self):
        res = self.client.delete(self.hospital_delete_url, input=self.test)
        self.assertEqual(res.status_code, 200)

    def test_user_cannot_delete_(self):
        res = self.client.delete(self.hospital_delete_url)
        self.assertEqual(res.status_code, 200)

    def test_user_view_by_id(self):
        res = self.client.get(self.hospital_view_url, input=self.test)
        self.assertEqual(res.status_code, 200)

    def test_user_cannot_view_by_id(self):
        res = self.client.get(self.hospital_view_url, input=uuid.uuid4())
        self.assertEqual(res.status_code, 200)

    def test_user_update_(self):
        res = self.client.patch(self.hospital_update_url, input=self.test)
        self.assertEqual(res.status_code, 200)

    def test_user_update_(self):
        res = self.client.patch(self.hospital_update_url)
        self.assertEqual(res.status_code, 200)


class TestHospitalSerializer(TestCase):
    def test_user_serializer(self):

        self.hospital_data = {
            "hospital_name": "Sant Singaji Hospital",
            "hospital_email": "singaji@gmail.com",
            "hospital_phone": '9691279019',
            "hospital_owner_name": "Pranjal Dubey",
            "hospital_owner_phone": "9691279018",
            "hospital_owner_email": "admin@gmail.com",
            "hospital_address": "Sandalpur",
            "hospital_city": "Khategaon",
            "hospital_status": "True",
            "hospital_logo":"test url",
            "hospital_type": "Private",
            "hospital_category": "General",
            "username": "Admin",
            "password": "admin@123"
        }
        serializer = HospitalSerializer(data=self.hospital_data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.errors, {})

    def test_HospitalLogin_serializer(self):
        self.hospital_login_data = {
            "username": "test@gmail.com",
            "password": "test"

        }
        serializer = HospitalLoginSerializer(data=self.hospital_login_data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.errors, {})


class HospitalModelTestCase(TestCase):
    def test_hospital_model(self):
        hospital_name = "Sant Singaji Hospital"
        hospital_email = "singaji@gmail.com"
        hospital_phone = 9691279019
        hospital_owner_name = "Pranjal Dubey"
        hospital_owner_phone = 9691279018
        hospital_owner_email = "admin@gmail.com"
        hospital_address = "Sandalpur"
        hospital_city = "Khategaon"
        hospital_status = False
        hospital_logo = "test url"
        hospital_type = "Private"
        hospital_category = "General"
        username = "Admin"
        password = "admin@123"
        hospital = Hospital.objects.create(hospital_name=hospital_name, hospital_email=hospital_email, hospital_phone=hospital_phone, hospital_owner_name=hospital_owner_name, hospital_owner_phone=hospital_owner_phone, hospital_owner_email=hospital_owner_email,
                                           hospital_address=hospital_address, hospital_city=hospital_city, hospital_status=hospital_status,hospital_logo = hospital_logo, hospital_type=hospital_type, hospital_category=hospital_category, username=username, password=password)
        self.assertEqual(hospital_name, hospital.hospital_name)
        self.assertEqual(hospital_email, hospital.hospital_email)
        self.assertEqual(hospital_phone, hospital.hospital_phone)
        self.assertEqual(hospital_owner_name, hospital.hospital_owner_name)
        self.assertEqual(hospital_owner_phone, hospital.hospital_owner_phone)
        self.assertEqual(hospital_owner_email, hospital.hospital_owner_email)
        self.assertEqual(hospital_address, hospital.hospital_address)
        self.assertEqual(hospital_city, hospital.hospital_city)
        self.assertFalse(hospital_status, hospital.hospital_status)
        self.assertEqual(hospital_logo,hospital.hospital_logo)
        self.assertEqual(hospital_type, hospital.hospital_type)
        self.assertEqual(hospital_category, hospital.hospital_category)
        self.assertEqual(username, hospital.username)
        self.assertEqual(password, hospital.password)
