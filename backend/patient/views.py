from patient.models import Patient
from patient.serializers import *
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework import status
from rest_framework.filters import SearchFilter
from user.models import User
from rest_framework.generics import GenericAPIView
from rest_framework_simplejwt.tokens import RefreshToken
from hospital_management.custom_paginations import CustomPagination
from error.models import Error
from employee.models import Employee
from hospital_management.responses import ResponseMessage
from rest_framework.permissions import IsAuthenticated
# from hospital_management.email import send_verification_email
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from user.models import User
import jwt
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
#     serializer_class = PatientRegisterSerializer
#     permission_classes = [IsAuthenticated]

#     def user_verification(user):
#         verification_token = get_tokens_for_user(user)
#         user_id = str(user.user_id)
#         user_email = user.user_email
#         url = 'https://hospital-management-six-chi.vercel.app/api/user/verification/?user_id=' + \
#             user_id + '&token=' + verification_token['access']
#         send_verification_email(url, user_email)


class PatientRegister(GenericAPIView):
    serializer_class = PatientRegisterSerializer

    def options(self, request, *args, **kwargs):
        allowed_methods = ['GET', 'POST', 'PUT', 'DELETE']
        response = Response({
            'message': 'This endpoint supports:',
            'allowed_methods': allowed_methods
        })
        return response

    def post(self, request, format=None):
        if Employee.objects.filter(employee_email=request.data.get('patient_email')).count() >= 1 or Patient.objects.filter(patient_email=request.data.get('patient_email')).count() >= 1:

            response_message = ''
            response_code = ''
            try:
                error = Error.objects.get(error_title='ALREADY_REGISTERED')
                response_message = error.error_message
                response_code = error.error_code
                Response.status_code = error.error_code
            except:
                response_message = ResponseMessage.ALREADY_REGISTERED
                response_code = status.HTTP_400_BAD_REQUEST
            logger.warning({
                'timestamp': current_timestamp,
                'method': request.method,
                'path': request.path,
                'status': response_code,
                'message': 'Patient' + response_message,
                'email': user.user_email,
                'user_role': user.user_role
            })
            return Response(
                {
                    'status': response_code,
                    'message': 'Patient ' + response_message
                },
            )

        else:
            serializer = PatientRegisterSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            patient = Patient.objects.get(
                patient_email=request.data.get('patient_email'))

            member = patient.patient_id
            user_name = patient.patient_name
            user_email = request.data.get('patient_email')
            user_password = request.data.get('password')
            user_role = "Patient"

            user = User.objects.create_user(
                member, user_name, user_email, user_role, user_password)
            print(user.status)
            user.status = True
            print(user.status)
            user.save()
            # UserRegister.user_verification(user)
            response_message = ''
            response_code = ''
            try:
                error = Error.objects.get(error_title='REGISTRATION_SUCCESS')
                response_message = error.error_message
                response_code = error.error_code
                Response.status_code = error.error_code
            except:
                response_message = ResponseMessage.REGISTRATION_SUCCESS
                response_code = status.HTTP_201_CREATED
            logger.info({
                'timestamp': current_timestamp,
                'method': request.method,
                'path': request.path,
                'status': response_code,
                'message': 'Patient' + response_message,
                'email': user.user_email,
                'user_role': user.user_role
            })
            return Response(
                {
                    'status': response_code,
                    'message': 'Patient ' + response_message
                },
            )


class PatientView(ListAPIView):
    queryset = Patient.objects.all().order_by('created_at')
    serializer_class = PatientSerializer
    filter_backends = [OrderingFilter, SearchFilter, DjangoFilterBackend]
    pagination_class = CustomPagination
    filterset_fields = ['patient_name']
    ordering_fields = ['patient_name']
    search_fields = ['patient_name']
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        response_message = ""
        response_code = ""

        header_value = request.headers['Authorization']
        token = header_value.split(' ')[1]
        payload = jwt.decode(token, "secret", algorithms=['HS256'])
        user_id = payload['user_id']
        user = User.objects.get(user_id=user_id)
        user_role = user.user_role

        if user_role == "Patient":
            patient_id = user.member_id
            patient = ""
            for data in response.data:
                if data['patient_id'] == str(patient_id):
                    patient = data
                else:
                    pass
            response.data = list()
            response.data.append(patient)

        try:
            error = Error.objects.get(error_title='RETRIEVED_SUCCESS')
            response_message = error.error_message
            response_code = error.error_code
            Response.status_code = error.error_code
        except:
            response_message = ResponseMessage.RETRIEVED_SUCCESS
            response_code = status.HTTP_200_OK
        logger.info({
            'timestamp': current_timestamp,
            'method': request.method,
            'path': request.path,
            'status': response_code,
            'message': 'Patient' + response_message,
            'email': user.user_email,
            'user_role': user.user_role
        })
        return Response(
            {
                'status': response_code,
                'message': "Patient " + response_message,
                "count": len(response.data),
                'data': response.data,
            }
        )


class PatientViewById(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, input=None, format=None):
        id = input
        if id is not None:
            if Patient.objects.filter(patient_id=id).count() >= 1:
                doctor = Patient.objects.get(patient_id=id)
                serializer = PatientSerializer(doctor)
                response_message = ""
                response_code = ""
                try:
                    error = Error.objects.get(error_title='RETRIEVED_SUCCESS')
                    response_message = error.error_message
                    response_code = error.error_code
                    Response.status_code = error.error_code
                except:
                    response_message = ResponseMessage.RETRIEVED_SUCCESS
                    response_code = status.HTTP_200_OK
                logger.info({
                    'timestamp': current_timestamp,
                    'method': request.method,
                    'path': request.path,
                    'status': response_code,
                    'message': 'Patient' + response_message,
                    'email': serializer.data.patient_email,
                })
                return Response(
                    {
                        'status': response_code,
                        'message': "Patient " + response_message,
                        'data': serializer.data
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
                    response_message = ResponseMessage.INVALID_ID
                    response_code = status.HTTP_400_BAD_REQUEST
                return Response(
                    {
                        'status': response_code,
                        'message': response_message,
                    },
                )


class PatientUpdate(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, input, format=None):
        id = input
        if Patient.objects.filter(patient_id=id).count() >= 1:
            patient = Patient.objects.get(patient_id=id)
            serializer = PatientSerializer(
                patient, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            user = User.objects.get(member_id=id)
            user.password = patient.password
            user.user_password = patient.password
            user.save()
            response_message = ""
            response_code = ""
            try:
                error = Error.objects.get(error_title='UPDATE_SUCCESS')
                response_message = error.error_message
                response_code = error.error_code
                Response.status_code = error.error_code
            except:
                response_message = ResponseMessage.UPDATE_SUCCESS
                response_code = status.HTTP_200_OK
            return Response(
                {
                    'status': response_code,
                    'message': 'Patient ' + response_message,
                },
            )
        else:
            Response.status_code = error.error_code
            return Response(
                {
                    'status': status.HTTP_400_BAD_REQUEST,
                    'message': "Invalid Patient Id",
                },
            )


class PatientDelete(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, input, format=None):
        id = input
        if Patient.objects.filter(patient_id=id).count() >= 1:
            doctor = Patient.objects.get(patient_id=id)
            doctor.delete()
            response_message = ""
            response_code = ""
            try:
                error = Error.objects.get(error_title='DELETE_SUCCESS')
                response_message = error.error_message
                response_code = error.error_code
                Response.status_code = error.error_code
            except:
                response_message = ResponseMessage.DELETE_SUCCESS
                response_code = status.HTTP_200_OK
            return Response(
                {
                    'status': response_code,
                    'message': "Patient " + response_message,
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
                response_message = ResponseMessage.INVALID_ID
                response_code = status.HTTP_400_BAD_REQUEST
            return Response(
                {
                    'status': response_code,
                    'message': response_message,
                },
            )
