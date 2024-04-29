
from doctor.serializers import *
from rest_framework.generics import GenericAPIView
from rest_framework.generics import ListAPIView
from rest_framework.filters import SearchFilter
from rest_framework.response import Response
from rest_framework.views import APIView
from doctor.models import Doctor
from rest_framework import status
from error.models import Error
from doctor.custom_orderings import CustomOrderingFilter
from hospital_management.custom_paginations import CustomPagination
from hospital_management.responses import ResponseMessage
from leave.models import Leave
import json
from datetime import datetime, timedelta , time
from appointment.models import Appointment
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from employee.models import Employee


class DoctorRegister(GenericAPIView):
    serializer_class = DoctorSerializer

    def post(self, request, format=None):
        serializer = DoctorSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        response_message = ""
        response_code = ""
        try:
            error = Error.objects.get(error_title='REGISTER_SUCCESS')
            response_message = error.error_message
            response_code = error.error_code
            Response.status_code = error.error_code
        except:
            response_message = ResponseMessage.REGISTRATION_SUCCESS
            response_code = status.HTTP_201_CREATED
            Response.status_code = status.HTTP_201_CREATED
        return Response(
            {
                'status': response_code,
                'message': 'Doctor ' + response_message
            },
        )


class DoctorView(ListAPIView):
    queryset = Doctor.objects.all().order_by('created_at')
    serializer_class = DoctorViewSerializer
    filter_backends = [SearchFilter, CustomOrderingFilter]
    pagination_class = CustomPagination
    filterset_fields = ['doctor_id']
    ordering_fields = ['doctor_id',]
    search_fields = ['doctor_id']

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        response_data = ""

        pagination = CustomPagination()
        if request.GET.get('pageSize') != None:
            if request.GET.get('pageSize') == "":
                response_data = response.data['results']
            else:
                response.data['page_size'] = int(request.GET.get('pageSize'))
                pagination.page_size = int(request.GET.get('pageSize'))
                response_data = response.data['results']
        else:
            response_data = response.data
        disease_specialist = request.GET.get('disease_specialist')

        inputDate = request.GET.get('date')
        remove_data = []
        if disease_specialist == "":
            pass
        else:
            for data in response_data:
                disease_data = json.loads(data.get('disease_specialist'))
                disease_tuple_data = tuple(disease_data)

                if disease_specialist is not None:
                    if disease_specialist in disease_tuple_data:
                        pass
                    else:
                        remove_data.append(data)

            for remove_d in remove_data:
                response_data.remove(remove_d)

        remove_data = []
        for data in response_data:
            if inputDate is not None:
                id = data.get('doctor_id')
                try:
                    leave = Leave.objects.filter(doctor=id)
                    if leave is not None:
                        for leave_obj in leave:
                            if str(leave_obj.date) == str(inputDate):
                                remove_data.append(data)
                                break
                except:
                    pass
        for remove_d in remove_data:
            response_data.remove(remove_d)

        for data in response_data:
            disease_data = json.loads(data.get('disease_specialist'))
            data['disease_specialist'] = disease_data

            times_data = json.loads(data.get('times'))

            data['times'] = times_data

            days_data = json.loads(data.get('day'))
            data['day'] = days_data

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
                'message': "Doctor " + response_message,
                'count': len(response_data),
                'data': response.data,
            }
        )


class DoctorViewById(APIView):
    def get(self, request, input=None, format=None):
        id = input
        if id is not None:
            if Doctor.objects.filter(doctor_id=id).count() >= 1:
                doctor = Doctor.objects.get(doctor_id=id)
                inputDate = request.GET.get('date')
                try:
                    leave = Leave.objects.get(doctor=id)
                except:
                    pass
                if inputDate is not None:
                    if str(leave.date) == str(inputDate):
                        doctor.status = "Unavailable"
                        print(doctor.status)
                    else:
                        doctor.status = "Available"

                serializer = DoctorViewSerializer(doctor)
                serializer_data = serializer.data
                disease_data = json.loads(
                    serializer_data['disease_specialist'])
                serializer_data['disease_specialist'] = disease_data
                times_data = json.loads(serializer_data['times'])
                serializer_data['times'] = times_data
                day_data = json.loads(serializer_data['day'])
                serializer_data['day'] = day_data
                for data in times_data:
                    start_time = data['start_time']
                    end_time = data['end_time']
                    t1 = datetime.strptime(start_time, "%H:%M:%S")
                    t2 = datetime.strptime(end_time, "%H:%M:%S")
                    diiff = t2-t1
                    per_patient_time = serializer_data['per_patient_time']
                    time_parts = per_patient_time.split(':')
                    time_deltaa = timedelta(hours=int(time_parts[0]), minutes=int(
                        time_parts[1]), seconds=int(time_parts[2]))
                    slot = diiff/time_deltaa
                    data['total_slots'] = int(slot)
                    appointment = Appointment.objects.filter(doctor_id = id)
                    for appoint in appointment:
                     start_time_iso = time.fromisoformat(start_time)
                     end_time_iso = time.fromisoformat(end_time)
                     between_time = appoint.appointment_time
                     if  between_time>= start_time_iso and between_time <= end_time_iso:
                             slot = slot-1
                     else:
                         pass
                    data['slots'] = int(slot)
                                   
                slots_data = json.dumps(serializer_data['times'])
                doctor.times = slots_data
                doctor.save()
                
                try:
                    error = Error.objects.get(error_title='RETRIEVED_SUCCESS')
                    response_message = error.error_message
                    response_code = error.error_code
                    Response.status_code = error.error_code
                except:
                    response_message = ResponseMessage.RETRIEVED_SUCCESS
                    response_code = status.HTTP_200_OK
                return Response(
                    {
                        'status': response_code,
                        'message': "Doctor " + response_message,
                        'data': serializer_data
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


class DoctorUpdate(GenericAPIView):
    serializer_class = DoctorUpdateSerializer

    def patch(self, request, input, format=None):
        id = input
        if Doctor.objects.filter(doctor_id=id).count() >= 1:
            doctor = Doctor.objects.get(doctor_id=id)
            serializer = DoctorSerializer(
                doctor, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
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
                    'message': 'Doctor ' + response_message,
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


class DoctorDelete(APIView):
    def delete(self, request, input, format=None):
        id = input
        if Doctor.objects.filter(doctor_id=id).count() >= 1:
            doctor = Doctor.objects.get(doctor_id=id)
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
                    'message': "Doctor " + response_message,
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
