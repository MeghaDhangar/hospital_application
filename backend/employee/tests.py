from django.test import TestCase
from django.test import TestCase
from rest_framework.test import APITestCase
from django.urls import reverse
import pdb
import uuid
from employee.serializers import EmployeeSerializer
from employee.models import Employee


class TestSetUp(APITestCase):
    def setUp(self):
        self.employee_add = reverse('employee add')
        self.employee_view = reverse('employee view')

        self.test = uuid.uuid4()
        self.employee_view_url = reverse(
            'employee view by id', kwargs={'input': self.test})
        self.employee_delete_url = reverse(
            'employee delete', kwargs={'input': self.test})
        self.employee_update_url = reverse(
            'employee update', kwargs={'input': self.test})
        self.employee_data = {
            "employee_name": "test",
            "employee_email": "test@example.com",
            "employee_number": 8115515,
            "employee_password": "test",
            "employee_role": "Doctor",
            "created_by":"hgfds",
            "updated_by":"kjhgf"

            
        }
        return super().setUp()

    def tearDown(self):
        return super().tearDown()


class Testview(TestSetUp):
    def test_employee_can_add(self):
        res = self.client.post(self.employee_add,self.employee_data,format='json')
        pdb.set_trace()
        self.assertEqual(res.status_code, 400)

    def test_employee0_cannot_add(self):
        res = self.client.post(self.employee_add)
        self.assertEqual(res.status_code, 400)

    def test_employee_view(self):
        res = self.client.get(self.employee_view)
        self.assertEqual(res.status_code, 200)

    def test_employee_cannot_view(self):
        res = self.client.post(self.employee_view)
        self.assertEqual(res.status_code, 405)

    def test_employee_view_by_id(self):
        res = self.client.get(self.employee_view_url, input=self.test)
        self.assertEqual(res.status_code, 200)

    def test_employee_cannot_view_by_id(self):
        res = self.client.get(self.employee_view_url, input=75421)
        self.assertEqual(res.status_code, 200)

    def test_employee_update_(self):
        res = self.client.patch(self.employee_update_url, input=self.test)
        self.assertEqual(res.status_code, 200)

    def test_employee_can_update_(self):
        res = self.client.post(self.employee_update_url,input=85874984)
        self.assertEqual(res.status_code, 405)

    def test_employee_delete(self):
        res = self.client.delete(self.employee_delete_url, input=self.test)
        self.assertEqual(res.status_code, 200)
    def test_employee_cannot_delete(self):
        res = self.client.post(self.employee_delete_url, input=self.test)
        self.assertEqual(res.status_code, 405)

class EmployeeSerializerTest(TestCase):
    def test_serializer(self):
        self.employee_data = {
            "employee_name": "test",
            "employee_email": "test@example.com",
            "employee_number": 8115515,
            "employee_password": "test",
            "employee_type": "Part Time",
            "employee_role": "Doctor",
            "employee_status": "Available"
            
        }
        serializer = EmployeeSerializer(data=self.employee_data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.errors, {})


class TestEmployeeModel(TestCase):
    def test_model(self):
       employee_name = "test",
       employee_email = "test@example.com",
       employee_number = 78474745
       employee_password = "testpassword"
       employee_type = "Part Time"
       employee_role = "Doctor"
       employee_status = "Available"
       employee = Employee.objects.create(employee_name=employee_name, employee_email=employee_email, employee_number=employee_number, employee_password=employee_password, employee_type=employee_type,employee_role=employee_role,employee_status=employee_status)
       self.assertEqual(employee_name,employee.employee_name)
       self.assertEqual(employee_email,employee.employee_email)
       self.assertEqual(employee_number,employee.employee_number)
       self.assertEqual(employee_password,employee.employee_password)
       self.assertEqual(employee_type,employee.employee_type)
       self.assertEqual(employee_status,employee.employee_status)


      


