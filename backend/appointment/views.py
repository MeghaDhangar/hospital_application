from appointment.serializers import *
from rest_framework.generics import GenericAPIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from appointment.models import Appointment
from rest_framework.views import APIView
from rest_framework import status
from error.models import Error
from hospital_management.email import send_appointment_email
from hospital_management.responses import ResponseMessage
from datetime import timedelta
from django.utils import timezone
from django.db.models import Count
from hospital_management.custom_paginations import CustomPagination
from rest_framework.filters import OrderingFilter
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from rest_framework.permissions import IsAuthenticated
from user.models import User
import jwt
from doctor.models import Doctor
from employee.models import Employee
from disease.models import Disease
from prescription.models import Prescription
from checkup.models import CheckUp
from datetime import datetime, timedelta
from patient.models import Patient
from hospital_management.logger import logger
from datetime import datetime


current_datetime = datetime.now()
current_timestamp = current_datetime.strftime('%Y-%m-%d %H:%M:%S')


class AppointmentAdd(GenericAPIView):
    serializer_class = AppointmentAddSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        serializer = AppointmentAddSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        appointment = serializer.save()

        header_value = request.headers['Authorization']
        token = header_value.split(' ')[1]
        payload = jwt.decode(token, "secret", algorithms=['HS256'])
        user_id = payload['user_id']
        user = User.objects.get(user_id=user_id)
        user_role = user.user_role

        if user_role == "Manager" or user_role == "Admin":
            Response.status_code = status.HTTP_401_UNAUTHORIZED
            logger.info({
                'timestamp': current_timestamp,
                'method': request.method,
                'path': request.path,
                'status': status.HTTP_401_UNAUTHORIZED,
                'message': "Unauthorized Access",
                'email': user.user_email,
                'user_role': user_role,
            })
            return Response(
                {
                    'status': status.HTTP_401_UNAUTHORIZED,
                    'message': "Unauthorized Access",
                }
            )
        if user_role == "Doctor":
            if request.GET.get('doctor_id') is None:
                Response.status_code = status.HTTP_401_UNAUTHORIZED
                logger.info({
                    'timestamp': current_timestamp,
                    'method': request.method,
                    'path': request.path,
                    'status': status.HTTP_401_UNAUTHORIZED,
                    'message': "Unauthorized Access",
                    'email': user.user_email,
                    'user_role': user_role,
                })
                return Response(
                    {
                        'status': status.HTTP_401_UNAUTHORIZED,
                        'message': "Unauthorized Access",
                    }
                )

        send_appointment_email(appointment)
        response_message = ""
        response_code = ""
        try:
            error = Error.objects.get(error_title='BOOKED_SUCCESS')
            response_message = error.error_message
            response_code = error.error_code
            Response.status_code = error.error_code
            logger.info({
                'timestamp': current_timestamp,
                'method': request.method,
                'path': request.path,
                'status': response_code,
                'message': "Appointment" + response_message,
                'email': user.user_email,
            })
        except:
            response_message = ResponseMessage.BOOKED_SUCCESS
            response_code = status.HTTP_201_CREATED
        return Response(
            {
                'status': response_code,
                'message': 'Appointment ' + response_message
            },
        )


class AppointmentTab(ListAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, input, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        id = input
        lists = []
        if Appointment.objects.filter(patient_id=id).count() >= 1:
            appointments = Appointment.objects.filter(patient_id=id)
            for appointment in appointments:
                appointment_id = appointment.appointment_id
                appointment_date = appointment.appointment_date
                appointment_time = appointment.appointment_time
                appointment_checkup_status = ""
                prescription = ""
                disease_name = ""
                doctor_name = ""
                checkups = CheckUp.objects.filter(
                    appointment=appointment.appointment_id)
                for checkup in checkups:
                    appointment_checkup_status = checkup.check_status
                prescriptions = Prescription.objects.filter(
                    appointment_id=appointment.appointment_id)
                for prescription in prescriptions:
                    prescription = prescription.prescription_photo
                diseases = Disease.objects.filter(
                    disease_id=appointment.disease_id)
                for disease in diseases:
                    disease_name = disease.disease_name
                doctors = Doctor.objects.filter(
                    doctor_id=appointment.doctor_id)
                for doctor in doctors:

                    employees = Employee.objects.filter(
                        employee_id=doctor.employee_id)
                    for employee in employees:
                        doctor_name = employee.employee_name
                new_dict = {"appointment_id": appointment_id, "doctor_name": doctor_name, "disease_name": disease_name, "appointment_date": appointment_date,
                            "appointment_time": appointment_time, "check_status": appointment_checkup_status, "prescription": prescription, "tab": ""}
                lists.append(new_dict)

            for list in lists:
                if list['appointment_date'] == datetime.today().date():
                    list['tab'] = 'todays'
                if list['appointment_date'] > datetime.today().date():
                    list['tab'] = 'upcoming'
                if list['appointment_date'] < datetime.today().date():
                    list['tab'] = 'previous'
            return Response({
                'status': status.HTTP_200_OK,
                'message': ResponseMessage.RETRIEVED_SUCCESS,
                'data': lists
            })
        else:
            return Response({
                'status': status.HTTP_400_BAD_REQUEST,
                'message': ResponseMessage.INVALID_ID
            })


class AppointmentCount(ListAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        response_message = ""
        response_code = ""
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=6)

        header_value = request.headers['Authorization']
        token = header_value.split(' ')[1]
        payload = jwt.decode(token, "secret", algorithms=['HS256'])
        user_id = payload['user_id']
        user = User.objects.get(user_id=user_id)
        user_role = user.user_role

        if user_role == "Patient":
            Response.status_code = status.HTTP_401_UNAUTHORIZED
            logger.info({
                'timestamp': current_timestamp,
                'method': request.method,
                'path': request.path,
                'status': status.HTTP_401_UNAUTHORIZED,
                'message': "Unauthorized Access",
                'email': user.user_email,
                'user_role': user.user_role
            })
            return Response(
                {
                    'status': status.HTTP_401_UNAUTHORIZED,
                    'message': "Unauthorized Access",
                }
            )
        if user_role == "Doctor":
            Response.status_code = status.HTTP_401_UNAUTHORIZED
            logger.info({
                'timestamp': current_timestamp,
                'method': request.method,
                'path': request.path,
                'status': status.HTTP_401_UNAUTHORIZED,
                'message': "Unauthorized Access",
                'email': user.user_email,
                'user_role': user.user_role
            })
            return Response(
                {
                    'status': status.HTTP_401_UNAUTHORIZED,
                    'message': "Unauthorized Access",
                }
            )

        # appointments_in_week = self.queryset.filter(
        #     appointment_date__range=[start_date, end_date])
        # appointments_per_day = appointments_in_week.values('appointment_date').annotate(appointment_count=Count(
        #     'appointment_date'), doctor_count=Count('doctor', distinct=True), patient_count=Count('patient')).order_by('appointment_date')

        # if not appointments_per_day:

        #     # Return a JsonResponse with 'Data Not Found' message
        #     return Response({
        #         'status': 404,
        #         'message': "Data not found"
        #     })

        appointment_list = []
        appointment_date_list = []

        duplicate_doctor = set()
        duplicate_patient = set()
        appointment_count = 0
        doctor = 1
        appointment_datee = Appointment.objects.order_by('appointment_date')
        for date in appointment_datee:
            appointment_date_list.append(date.appointment_date)
        # appointment_date_set = set(appointment_date_list)
        # appointment_date_list_2 = [appointment_date_set]
        for date in appointment_date_list:
            appointment_detail = Appointment.objects.filter(
                appointment_date=date)
            for appointment in appointment_detail:

                appointment_count += 1
                duplicate_doctor.add(appointment.doctor_id)
                duplicate_patient.add(appointment.patient_id)

            new_dict = {"appointment_date": appointment.appointment_date, "appointment_count": appointment_count,
                        "patient_count": len(duplicate_patient), "doctor_count": len(duplicate_doctor)}
            if new_dict in appointment_list:
                duplicate_doctor = set()
                duplicate_patient = set()
                appointment_count = 0
            else:
                appointment_list.append(new_dict)
                duplicate_doctor = set()
                duplicate_patient = set()
                appointment_count = 0
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
            'message': "Appointment " + response_message,
            'email': user.user_email,
            'user_role': user.user_role
        })
        return Response(
            {
                'status': response_code,
                'message': "Appointment " + response_message,
                "appointments_per_day": appointment_list
            }
        )


class AppointmentView(ListAPIView):
    queryset = Appointment.objects.all().order_by('-created_at')
    serializer_class = AppointmentViewSerializer
    filter_backends = [OrderingFilter, SearchFilter, DjangoFilterBackend]
    pagination_class = CustomPagination
    filterset_fields = ['appointment_id', 'doctor_id', 'appointment_time',
                        'patient_id', 'appointment_date', 'appointment_time']
    ordering_fields = ['appointment_number', 'appointment_date']
    search_fields = ['appointment_number', 'appointment_date']
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
            if request.GET.get('patient_id') is None:
                patient_id = user.member_id
                patient = ""
                res = list()
                for data in response.data:
                    if data['patient']['patient_id'] == str(patient_id):
                        res.append(data)
                    else:
                        pass
                response.data = list()
                response.data = res

        if user_role == "Doctor":
            if request.GET.get('doctor_id') is None:
                employee_id = user.member_id
                doctor_id = Doctor.objects.get(
                    employee_id=employee_id).doctor_id
                res = list()
                for data in response.data:
                    if data['doctor']['doctor_id'] == str(doctor_id):
                        res.append(data)
                    else:
                        pass
                response.data = list()
                response.data = res

        # for data in response.data:
        #     try:
        #         doctor = Doctor.objects.get(doctor_id=data['doctor'])
        #         employee = Employee.objects.get(employee_id=doctor.employee_id)
        #         patient = Patient.objects.get(patient_id=data['patient'])
        #         disease = Disease.objects.get(disease_id=data['disease'])
        #         doctor_dict = {}
        #         doctor_dict['doctor_id'] = doctor.doctor_id
        #         doctor_dict['employee'] = {
        #             'employee_id': employee.employee_id,
        #             'employee_name': employee.employee_name
        #         }
        #         data['doctor'] = doctor_dict
        #         patient_dict = {}
        #         patient_dict['patient_id'] = patient.patient_id
        #         patient_dict['patient_name'] = patient.patient_name
        #         data['patient'] = patient_dict
        #         disease_dict = {}
        #         disease_dict['disease_id'] = disease.disease_id
        #         disease_dict['disease_name'] = disease.disease_name
        #         data['disease'] = disease_dict
        #     except:
        #         return Response(
        #             {
        #                 'status': status.HTTP_500_INTERNAL_SERVER_ERROR,
        #                 'message': "Internal Server Error",
        #             }
        #         )
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
            'message': "Appointment " + response_message,
            'email': user.user_email,
            'user_role': user.user_role
        })
        return Response(
            {
                'status': response_code,
                'message': "Appointment " + response_message,
                'data': response.data,
            }
        )


class AppointmentViewById(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, input=None, format=None):
        id = input
        if id is not None:
            if Appointment.objects.filter(appointment_id=id).count() >= 1:
                appointment = Appointment.objects.get(appointment_id=id)
                serializer = AppointmentSerializer(appointment)
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
                    Response.status_code = status.HTTP_200_OK
                return Response(
                    {
                        'status': response_code,
                        'message': 'Appointment ' + response_message,
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


class AppointmentUpdate(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, input, format=None):
        id = input
        if request.data == {}:
            response_message = ""
            response_code = ""

            header_value = request.headers['Authorization']
            token = header_value.split(' ')[1]
            payload = jwt.decode(token, "secret", algorithms=['HS256'])
            user_id = payload['user_id']
            user = User.objects.get(user_id=user_id)
            user_role = user.user_role

            if user_role == "Manager":
                Response.status_code = status.HTTP_401_UNAUTHORIZED
                logger.info({
                    'timestamp': current_timestamp,
                    'method': request.method,
                    'path': request.path,
                    'status': status.HTTP_401_UNAUTHORIZED,
                    'message': "Unauthorized Access",
                    'email': user.user_email,
                    'user_role': user.user_role
                })
                return Response(
                    {
                        'status': status.HTTP_401_UNAUTHORIZED,
                        'message': "Unauthorized Access",
                    }
                )
            if user_role == "Admin":
                Response.status_code = status.HTTP_401_UNAUTHORIZED
                logger.info({
                    'timestamp': current_timestamp,
                    'method': request.method,
                    'path': request.path,
                    'status': status.HTTP_401_UNAUTHORIZED,
                    'message': "Unauthorized Access",
                    'email': user.user_email,
                    'user_role': user.user_role
                })
                return Response(
                    {
                        'status': status.HTTP_401_UNAUTHORIZED,
                        'message': "Unauthorized Access",
                    }
                )

            try:
                error = Error.objects.get(error_title='EMPTY_REQUEST')
                response_message = error.error_message
                response_code = error.error_code
                Response.status_code = error.error_code
            except:
                response_message = ResponseMessage.EMPTY_REQUEST
                response_code = status.HTTP_400_BAD_REQUEST
            logger.info({
                'timestamp': current_timestamp,
                'method': request.method,
                'path': request.path,
                'status': response_code,
                'message': response_message,
                'email': user.user_email,
                'user_role': user.user_role
            })
            return Response(
                {
                    'status': response_code,
                    'message': response_message,
                },
            )
        else:
            if Appointment.objects.filter(appointment_id=id).count() >= 1:
                appointment = Appointment.objects.get(appointment_id=id)
                serializer = AppointmentSerializer(
                    appointment, data=request.data, partial=True)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                response_message = ""
                response_code = ""

                header_value = request.headers['Authorization']
                token = header_value.split(' ')[1]
                payload = jwt.decode(token, "secret", algorithms=['HS256'])
                user_id = payload['user_id']
                user = User.objects.get(user_id=user_id)
                user_role = user.user_role

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
                    'message': 'Appointment ' + response_message,
                })
                return Response(
                    {
                        'status': response_code,
                        'message': 'Appointment ' + response_message,
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


class AppointmentDelete(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, input, format=None):
        id = input
        if Appointment.objects.filter(appointment_id=id).count() >= 1:
            appointment = Appointment.objects.get(appointment_id=id)
            appointment.delete()
            response_message = ""
            response_code = ""

            header_value = request.headers['Authorization']
            token = header_value.split(' ')[1]
            payload = jwt.decode(token, "secret", algorithms=['HS256'])
            user_id = payload['user_id']
            user = User.objects.get(user_id=user_id)
            user_role = user.user_role

            if user_role == "Manager" or user_role == "Admin":
                Response.status_code = status.HTTP_401_UNAUTHORIZED
                return Response(
                    {
                        'status': status.HTTP_401_UNAUTHORIZED,
                        'message': "Unauthorized Access",
                    }
                )
            if user_role == "Doctor":
                Response.status_code = status.HTTP_401_UNAUTHORIZED
                return Response(
                    {
                        'status': status.HTTP_401_UNAUTHORIZED,
                        'message': "Unauthorized Access",
                    }
                )

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
                    'message': 'Appointment ' + response_message
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
