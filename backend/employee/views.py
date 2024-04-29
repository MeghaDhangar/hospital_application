from employee.serializers import EmployeeSerializer, EmployeeUpdateSerializer
from rest_framework.generics import GenericAPIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from employee.models import Employee
from user.models import User
from rest_framework import status
from doctor.serializers import DoctorSerializer
from error.models import Error
from hospital_management.custom_paginations import CustomPagination
from hospital_management.responses import ResponseMessage
from doctor.models import Doctor
import json
from rest_framework_simplejwt.tokens import RefreshToken
# from hospital_management.email import send_verification_email
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from user.models import User
from rest_framework.filters import SearchFilter
from rest_framework.permissions import IsAuthenticated
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
#     serializer_class = EmployeeSerializer
#     permission_classes = [IsAuthenticated]

#     def user_verification(user):
#         verification_token = get_tokens_for_user(user)
#         user_id = str(user.user_id)
#         # user_email = user.user_email
#         user_email = "achieversgrand@gmail.com"
#         url = 'https://hospital-management-six-chi.vercel.app/api/user/verification?user_id=' + \
#             user_id + '&token=' + verification_token['access']
#         send_verification_email(url, user_email)


class EmployeeAdd(GenericAPIView):
    serializer_class = EmployeeSerializer

    def post(self, request, format=None):
        if User.objects.filter(user_email=request.data.get('employee_email')).count() >= 1:
            response_message = ""
            response_code = ""
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
                'message': 'Employee ' + response_message,
                'email': request.data.get('employee_email'),
            })
            return Response(
                {
                    'status': response_code,
                    'message': 'Employee ' + response_message
                },
            )
        else:
            serializer = EmployeeSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            doctor = None
            employee = Employee.objects.get(
                employee_email=request.data.get('employee_email'))

            if employee.employee_role == 'Doctor':
                doctor_data = {
                    'employee': employee.employee_id,
                    'disease_specialist': json.dumps(['Asthma']),
                    'per_patient_time': '00:30:00',
                    'status': 'null',
                    'day': json.dumps(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']),
                    "times": json.dumps([{"start_time": "09:00:00", "end_time": "12:00:00", "slots": 0},
                                         {"start_time": "14:00:00",
                                             "end_time": "17:00:00", "slots": 0},
                                         {"start_time": "19:00:00", "end_time": "22:00:00", "slots": 0}])
                }
                doctor_serializer = DoctorSerializer(data=doctor_data)
                doctor_serializer.is_valid(raise_exception=True)
                doctor = doctor_serializer.save()
                member = employee.employee_id
            member = employee.employee_id
            user_name = employee.employee_name
            user_email = request.data.get('employee_email')
            user_password = request.data.get('employee_password')
            user_role = employee.employee_role

            user = User.objects.create_user(
                member, user_name, user_email, user_role, user_password)
            # UserRegister.user_verification(user)
            response_message = ""
            response_code = ""
            try:
                error = Error.objects.get(error_title='ADD_SUCCESS')
                response_message = error.error_message
                response_code = error.error_code
                Response.status_code = error.error_code
            except:
                response_message = ResponseMessage.ADD_SUCCESS
                response_code = status.HTTP_201_CREATED
            logger.info({
                'timestamp': current_timestamp,
                'method': request.method,
                'path': request.path,
                'status': response_code,
                'message': 'Employee ' + response_message,
                'email': user.user_email,
                'user_role': user.user_role
            })
            return Response(
                {
                    'status': response_code,
                    'message': 'Employee ' + response_message
                },
            )


class EmployeeView(ListAPIView):
    queryset = Employee.objects.all().order_by('-created_at')
    serializer_class = EmployeeSerializer
    filter_backends = [SearchFilter, DjangoFilterBackend]
    pagination_class = CustomPagination
    filterset_fields = ['employee_role', 'employee_name']
    search_fields = ['employee_name', 'employee_role']
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        response_message = ""
        response_code = ""
        response = super().list(request, *args, **kwargs)

        header_value = request.headers['Authorization']
        token = header_value.split(' ')[1]
        payload = jwt.decode(token, "secret", algorithms=['HS256'])
        user_id = payload['user_id']
        user = User.objects.get(user_id=user_id)
        user_role = user.user_role

        if user_role == "Patient" or user_role == "Doctor":
            Response.status_code = status.HTTP_401_UNAUTHORIZED
            return Response(
                {
                    'status': status.HTTP_401_UNAUTHORIZED,
                    'message': "Unauthorized Access",
                }
            )

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
            'message': 'Employee ' + response_message,
            'email': user.user_email,
        })
        return Response(
            {
                'status': response_code,
                'message': "Employee " + response_message,
                'data': response.data,
            }
        )


class EmployeeViewById(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, input=None, format=None):
        id = input
        if id is not None:
            if Employee.objects.filter(employee_id=id).count() >= 1:
                employee = Employee.objects.get(employee_id=id)
                serializer = EmployeeSerializer(employee)
                response_message = ""
                response_code = ""
                try:
                    error = Error.objects.get(error_title='RETRIEVED_SUCCESS')
                    response_message = error.error_message
                    response_code = error.error_code
                except:
                    response_message = ResponseMessage.RETRIEVED_SUCCESS
                    response_code = status.HTTP_200_OK
                logger.info({
                    'timestamp': current_timestamp,
                    'method': request.method,
                    'path': request.path,
                    'status': response_code,
                    'message': 'Employee ' + response_message,
                    'email': employee.employee_email,
                })
                return Response(
                    {
                        'status': response_code,
                        'message': "Employee " + response_message,
                        'data': serializer.data
                    },
                )
            else:
                try:
                    response_message = ""
                    response_code = ""
                    error = Error.objects.get(error_title='INVALID_ID')
                    response_message = error.error_message
                    response_code = error.error_code
                    Response.status_code = error.error_code
                except:
                    response_message = ResponseMessage.INVALID_ID
                    response_code = status.HTTP_400_BAD_REQUEST
                logger.warning({
                    'timestamp': current_timestamp,
                    'method': request.method,
                    'path': request.path,
                    'status': response_code,
                    'message': 'Employee ' + response_message,
                })
                return Response(
                    {
                        'status': response_code,
                        'message': response_message,
                    },
                )


class EmployeeDelete(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, input=None, format=None):
        id = input
        if Employee.objects.filter(employee_id=id).count() >= 1:
            employee = Employee.objects.get(employee_id=id)
            user = ""
            try:
                user = User.objects.get(member_id=id)
                user.delete()
            except:
                pass
            employee = employee.delete()
            response_message = ""
            response_code = ""
            try:
                error = Error.objects.get(error_title='DELETE_SUCCESS')
                response_message = error.error_message
                response_code = error.error_code
            except:
                response_message = ResponseMessage.DELETE_SUCCESS
                response_code = status.HTTP_200_OK
                Response.status_code = error.error_code
            logger.info({
                'timestamp': current_timestamp,
                'method': request.method,
                'path': request.path,
                'status': response_code,
                'message': 'Employee ' + response_message,
                'email': employee.employee_email,
                'user_role': employee.employee_role
            })
            return Response(
                {
                    'status': response_code,
                    'message': "Employee " + response_message,
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
            logger.warning({
                'timestamp': current_timestamp,
                'method': request.method,
                'path': request.path,
                'status': response_code,
                'message': 'Employee ' + response_message,
            })
            return Response(
                {
                    'status': response_code,
                    'message': "Employee " + response_message,
                },
            )


class EmployeeUpdate(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, input=None, format=None):
        id = input
        if Employee.objects.filter(employee_id=id).count() >= 1:
            employee = Employee.objects.get(employee_id=id)
            serializer = EmployeeUpdateSerializer(
                employee, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            user = User.objects.get(member_id=id)
            if request.data.get('employee_password') is not None:
                user.password = employee.employee_password
                user.user_password = employee.employee_password
            if request.data.get('employee_status') is not None:
                user.status = employee.employee_status
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
            logger.info({
                'timestamp': current_timestamp,
                'method': request.method,
                'path': request.path,
                'status': response_code,
                'message': 'Employee ' + response_message,
                'email': user.user_email,
            })
            return Response(
                {
                    'status': response_code,
                    'message': 'Employee ' + response_message,
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
