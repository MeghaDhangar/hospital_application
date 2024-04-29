from django.test import TestCase
from django.test import TestCase
from rest_framework.test import APITestCase
from django.urls import reverse
import pdb
import uuid
from user.serializers import UserLoginSerializer, UserRegisterSerializer,UserSerializer,UserProfileSerializer
from user.models import User
from datetime import datetime
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
test = uuid.uuid4()
print(test)
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'access': str(refresh.access_token),
    }

now = datetime.now() 

class TestSetUp(APITestCase):
    def setUp(self):
        self.user_add = reverse('user register')
        self.user_login = reverse('user login')
        self.user_view = reverse('user view')

        self.test = uuid.uuid4()
        self.user_view_url = reverse(
            'user view by id', kwargs={'input': self.test})
        self.user_delete_url = reverse(
            'user delete', kwargs={'input': self.test})
        self.user_update_url = reverse(
            'user update', kwargs={'input': self.test})
        self.user_login_data = {
           "user_email":"user@example.com",
           "user_password":"test@123",
           "is_verify": True           
        }
        return super().setUp()

    def tearDown(self):
        return super().tearDown()


class Testview(TestSetUp):

    def test_user_can_login(self):
        res = self.client.post(self.user_login,
                               self.user_login_data, format='json')
        self.assertEqual(res.status_code, 200)

    def test_user_view(self):
        res = self.client.get(self.user_view)
        self.assertEqual(res.status_code, 401)



    def test_user_update_(self):
        res = self.client.patch(self.user_update_url, input=self.test)
        self.assertEqual(res.status_code, 200)



    def test_prescription_delete(self):
        res = self.client.delete(self.user_delete_url, input=self.test)
        self.assertEqual(res.status_code, 200)


class UserSerializerTest(TestCase):
    def test_login_serializer(self):
        self.user_login_data = {
           "user_email":"user@example.com",
           "user_password":"test@123",
           "is_verify": True           
         }
        serializer = UserLoginSerializer(data=self.user_login_data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.errors, {})

 