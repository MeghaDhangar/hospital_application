from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework.views import APIView
from checkup.models import CheckUp
from rest_framework import status
from checkup.serializers import CheckupSerializer
from error.models import Error
from hospital_management.responses import ResponseMessage
from rest_framework.generics import ListAPIView
from hospital_management.custom_paginations import CustomPagination
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from rest_framework.filters import SearchFilter
from rest_framework.permissions import IsAuthenticated
from user.models import User
import jwt
from doctor.models import Doctor


class CheckUpAdd(GenericAPIView):
    serializer_class = CheckupSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        serializer = CheckupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
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
        return Response(
            {
                'status': response_code,
                'message': 'Checkup ' + response_message
            },
        )


class CheckUpDelete(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, input=None, format=None):
        id = input
        if CheckUp.objects.filter(checkup_id=id).count() >= 1:
            checkup = CheckUp.objects.get(checkup_id=id)
            checkup.delete()
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
                    'message': "Checkup " + response_message,
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


class CheckUpUpdate(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, input=None, format=None):
        id = input
        if CheckUp.objects.filter(checkup_id=id).count() >= 1:
            checkup = CheckUp.objects.get(checkup_id=id)
            serializer = CheckupSerializer.save(
                checkup, data=request.data, partial=True)
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
                    'message': 'Checkup ' + response_message,
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


class CheckUpViewById(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, input=None, format=None):
        id = input
        if id is not None:
            if CheckUp.objects.filter(checkup_id=id).count() >= 1:
                checkup = CheckUp.objects.get(checkup_id=id)
                serializer = CheckupSerializer(checkup)
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
                return Response(
                    {
                        'status': response_code,
                        'message': "Checkup " + response_message,
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


class CheckUpView(ListAPIView):
    queryset = CheckUp.objects.all().order_by('created_at')
    serializer_class = CheckupSerializer
    filter_backends = [OrderingFilter, SearchFilter, DjangoFilterBackend]
    pagination_class = CustomPagination
    filterset_fields = ['doctor_id', 'patient_id', 'appointment_id']
    ordering_fields = ['next_appointment_date']
    search_fields = ['doctor_id']
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
                res = list()
                print(patient_id)
                for data in response.data:
                    if str(data['patient']) == str(patient_id):
                        res.append(data)
                    else:
                        pass
                response.data = list()
                response.data = res

        if user_role == "Doctor":
            if request.GET.get('doctor_id') is None:
                employee_id = user.member_id
                doctor_id = Doctor.objects.get(employee_id=employee_id).doctor_id
                res = list()
                for data in response.data:
                    if str(data['doctor']) == str(doctor_id):
                        res.append(data)
                    else:
                        pass
                response.data = list()
                response.data = res

        pagination = CustomPagination()
        if request.GET.get('pageSize') != None:
            if request.GET.get('pageSize') == "":
                pass
            else:
                response.data['page_size'] = int(request.GET.get('pageSize'))
                pagination.page_size = int(request.GET.get('pageSize'))
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
                'message': "Checkup " + response_message,
                'data': response.data,
            }
        )
