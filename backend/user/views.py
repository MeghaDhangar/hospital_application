from rest_framework.views import APIView
from rest_framework.response import Response
from user.models import User
from rest_framework import status
from user.serializers import *
from rest_framework.generics import GenericAPIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from error.models import Error
from doctor.models import Doctor
from django.contrib.auth.hashers import make_password
from patient.models import Patient
from employee.models import Employee
from hospital_management.logger import logger
from datetime import datetime


current_datetime = datetime.now()
current_timestamp = current_datetime.strftime('%Y-%m-%d %H:%M:%S')

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'access': str(refresh.access_token),
        'refresh': str(refresh)
    }


# class UserRegister(GenericAPIView):
#     serializer_class = UserSerializer

#     def post(self, request, format=None):
#         serializer = UserSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
#         error = Error.objects.get(error_title='REGISTRATION_SUCCESS')
#         response_message = error.error_message
#         response_code = error.error_code
#         Response.status_code = error.error_code
#         return Response(
#             {
#                 'status': response_code,
#                 'message': 'User ' + response_message
#             },
#         )


class UserDelete(APIView):
    def delete(self, request, input, format=None):
        id = input
        if User.objects.filter(user_id=id).count() >= 1:
            doctor = User.objects.get(user_id=id)
            doctor.delete()
            response_message = ""
            response_code = ""
            try:
                error = Error.objects.get(error_title='DELETE_SUCCESS')
                response_message = error.error_message
                response_code = error.error_code
                Response.status_code = error.error_code
            except:
                response_message = "DELETE_SUCCESS"
                response_code = status.HTTP_200_OK
                Response.status_code = status.HTTP_200_OK
            return Response(
                {
                    'status': response_code,
                    'message': "User " + response_message,
                },
            )
        response_code = ""
        response_message = ""
        try:
            error = Error.objects.get(error_title='INVALID_ID')
            response_message = error.error_message
            response_code = error.error_code
            Response.status_code = error.error_code
        except:
            response_message = "INVALID_ID"
            response_code = status.HTTP_400_BAD_REQUEST
            Response.status_code = status.HTTP_400_BAD_REQUEST
        return Response(
            {
                'status': response_code,
                'message': response_message,
            },
        )


class UserLoginView(GenericAPIView):
    serializer_class = UserLoginSerializer

    def post(self, request, format=None):
        serializer = UserLoginSerializer(data=request.data)
        email = request.data.get('user_email')
        password = request.data.get('user_password')

        if User.objects.filter(user_email=email).count() >= 1:
            user = User.objects.get(user_email=email)
            is_verify = request.data.get('is_verify')

            if is_verify == True:
                token = get_tokens_for_user(user)
                Response.status_code = status.HTTP_200_OK
                id = ""
                if user.user_role == "Doctor":
                    id = Doctor.objects.get(
                        employee_id=user.member_id).doctor_id
                else:
                    id = user.member_id

                logger.info({
                    'timestamp': current_timestamp,
                    'method': request.method,
                    'path': request.path,
                    'status': status.HTTP_200_OK,
                    'message': "Logged In As " + user.user_role,
                    'email': user.user_email,
                    'name': user.user_name,
                })
                return Response(
                    {
                        'status': status.HTTP_200_OK,
                        'message': "Logged In As " + user.user_role,
                        'data': {
                            'user_role': user.user_role,
                            'id': id,
                            'token': token,
                        }
                    },
                )
            else:
                user = authenticate(user_email=email, password=password)
                if user is not None:
                    if user.status == True:
                        token = get_tokens_for_user(user)
                        Response.status_code = status.HTTP_200_OK
                        id = ""
                        if user.user_role == "Doctor":
                            id = Doctor.objects.get(
                                employee_id=user.member_id).doctor_id
                        else:
                            id = user.member_id
                        logger.info({
                            'timestamp': current_timestamp,
                            'method': request.method,
                            'path': request.path,
                            'status': status.HTTP_200_OK,
                            'message': "Logged In As " + user.user_role,
                            'email': user.user_email,
                            'name': user.user_name,
                        })
                        return Response(
                            {
                                'status': status.HTTP_200_OK,
                                'message': "Logged In As " + user.user_role,
                                'data': {
                                    'user_role': user.user_role,
                                    'id': id,
                                    'token': token,
                                }
                            },
                        )
                    else:
                        message = ""
                        if user.user_role == "Doctor" or user.user_role == "Manager":
                            message = "You Are Not Approved From Administrator"
                        if user.user_role == "Patient":
                            message = "Verify Your Email First"
                        Response.status_code = status.HTTP_400_BAD_REQUEST
                        return Response(
                            {
                                'status': status.HTTP_400_BAD_REQUEST,
                                'message': message,
                            },
                        )
                else:
                    Response.status_code = status.HTTP_400_BAD_REQUEST
                    return Response(
                        {
                            'status': status.HTTP_400_BAD_REQUEST,
                            'message': "Password Mismatch",
                        },
                    )
        else:
            Response.status_code = status.HTTP_404_NOT_FOUND
            return Response(
                {
                    'status': status.HTTP_404_NOT_FOUND,
                    'message': "User With This Email Is Not Registered",
                },
            )


# class UserVerificationView(APIView):
#     serializer_class = UserProfileSerializer

#     def post(self, request, format=None):
#         token = request.POST.get('token')
#         id = request.POST.get('id')
#         print(id, token)
#         user = User.objects.get(member_id=id)
#         user.status = True
#         Response.status_code = status.HTTP_200_OK
#         return Response(
#             {
#                 'status': status.HTTP_200_OK,
#                 'message': "User Verified",
#             },
#         )


class UserView(APIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        serializer = UserProfileSerializer(request.user)
        Response.status_code = status.HTTP_200_OK
        return Response(
            {
                'status': status.HTTP_200_OK,
                'data': serializer.data,
            }
        )


class UserUpdate(APIView):

    def patch(self, request, input, format=None):
        id = input
        if User.objects.filter(member_id=id).count() >= 1:
            doctor = User.objects.get(member_id=id)
            serializer = UserSerializer(
                doctor, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            try:
                error = Error.objects.get(error_title='UPDATE_SUCCESS')
                response_message = error.error_message
                response_code = error.error_code
                Response.status_code = error.error_code
            except:
                response_message = "UPDATE_SUCCESS"
                response_code = status.HTTP_200_OK
                Response.status_code = status.HTTP_200_OK
            return Response(
                {
                    'status': response_code,
                    'message': 'User ' + response_message,
                },
            )
        else:
            response_message = ""
            response_code = ""
            try:
                error = Error.objects.get(error_title='INVALID_ID')
                response_message = error.error_message
                response_code = error.error_code
                Response.status_code = error.error_code
            except:
                response_message = "INVALID ID"
                response_code = status.HTTP_400_BAD_REQUEST
                Response.status_code = status.HTTP_400_BAD_REQUEST
            return Response(
                {
                    'status': response_code,
                    'message': response_message,
                },
            )


class UserPasswordReset(APIView):
    def patch(self, request, format=None):
        user_email = request.data['user_email']
        user_password = request.data['user_password']

        user = User.objects.get(user_email=user_email)
        user.password = make_password(user_password)
        user.user_password = user_password
        user.save()

        if user.user_role == "Patient":
            patient = Patient.objects.get(patient_id=user.member_id)
            patient.password = user_password
            patient.save()
        if user.user_role == "Manager" or "Doctor":
            employee = Employee.objects.get(employee_id=user.member_id)
            employee.employee_password = user_password
            employee.save()
        return Response({
            'message': "Password Changed"
        })
