from django.test import TestCase

from django.test import RequestFactory, TestCase
from rest_framework.test import APITestCase
from django.urls import reverse
import pdb
import uuid
from leave.models import Leave
from leave.serializers import LeaveSerializer
from datetime import date , datetime



ddate = date.today()
now = datetime.now() 
time  = now.strftime("%H:%M:%S")

class TestSetUp(APITestCase):

    def setUp(self):
        self.leave_add = reverse('leave add')

        self.leave_view = reverse('leave profile view')
        self.test = uuid.uuid4()
        self.leave_view_url = reverse(
            'leave profile view by id', kwargs={'input': self.test})
        self.leave_update_url = reverse(
            'leave profile update', kwargs={'input': self.test})
        self.leave_delete_url = reverse(
            'leave profile delete', kwargs={'input': self.test})

        self.leave_data = {
            
            "start_time": time,
            "end_time": time,
            "date":ddate,
            "leave_description":"test description",
            "created_by":"tester",
            "updated_by":"tester",

        }

        return super().setUp()

    def tearDown(self):
        return super().tearDown()


class Testview(TestSetUp):
    def test_leave_can_add(self):
        res = self.client.post(self.leave_add,self.leave_data, format='json')
        
        self.assertEqual(res.status_code, 400)

    def test_leave_cannot_add(self):
        res = self.client.post(self.leave_add)

        self.assertEqual(res.status_code, 400)

    def test_leave_can_view(self):
        res = self.client.get(self.leave_view)
        self.assertEqual(res.status_code, 200)

    def test_patient_cannot_view(self):
        res = self.client.post(self.leave_view)
        self.assertEqual(res.status_code, 405)

    def test_patient_view_by_id(self):
        res = self.client.get(self.leave_view_url, input=self.test)
        self.assertEqual(res.status_code, 200)

    def test_patient_cannot_view_by_id(self):
        res = self.client.post(self.leave_view_url)
        self.assertEqual(res.status_code, 405)

    def test_patient_can_delete(self):
        res = self.client.delete(self.leave_delete_url, input=self.test)
        self.assertEqual(res.status_code, 200)

    def test_patient_cannot_delete_(self):
        res = self.client.post(self.leave_delete_url, input=uuid.uuid4())
        self.assertEqual(res.status_code, 405)

    def test_patient_update_(self):
        res = self.client.patch(self.leave_update_url, input=self.test)
        self.assertEqual(res.status_code, 200)

    def test_patient_update_(self):
        res = self.client.post(self.leave_update_url)
        self.assertEqual(res.status_code, 405)


class TestPatientSerializer(TestCase):
    def test_leave_serializer(self):
        self.leave_data = {
            "start_time": time,
            "end_time": time,
            "date":ddate,
            "leave_description":"test description",
            "created_by":"tester",
            "updated_by":"tester",
           
        }
        serializer = LeaveSerializer(data=self.leave_data)
        self.assertTrue(serializer.is_valid())
        pdb.set_trace()
        self.assertEqual(serializer.errors, {})


class LeaveModelTestCase(TestCase):
    def test_model(self):
        start_time = time
        end_time = time
        date  = ddate
        leave_description = "leave description"
        created_by = "tester"
        updated_by = "tester"

        leave = Leave.objects.create(start_time=start_time, end_time=end_time,date=date,leave_description=leave_description,created_by=created_by,updated_by=updated_by)

        self.assertEqual(start_time, leave.start_time)
        self.assertEqual(end_time, leave.end_time)
        self.assertEqual(date, leave.date)
        self.assertEqual(leave_description, leave.leave_description)
        self.assertEqual(created_by,leave.created_by)
        self.assertEqual(updated_by,leave.updated_by)

