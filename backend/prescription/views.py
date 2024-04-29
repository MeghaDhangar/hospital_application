from rest_framework.views import APIView
from rest_framework.response import Response
from prescription.serializer import PrescriptionSerializer, PrescriptionViewSerializer
from prescription.models import Prescription
from rest_framework import status
from rest_framework.generics import GenericAPIView
from error.models import Error
from hospital_management.responses import ResponseMessage
from rest_framework.permissions import IsAuthenticated
from user.models import User
import jwt


class PrescriptionAdd(GenericAPIView):
    serializer_class = PrescriptionSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        serializer = PrescriptionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        response_message = ''
        response_code = ''

        header_value = request.headers['Authorization']
        token = header_value.split(' ')[1]
        payload = jwt.decode(token, "secret", algorithms=['HS256'])
        user_id = payload['user_id']
        user = User.objects.get(user_id=user_id)
        user_role = user.user_role

        if user_role == "Patient":
            Response.status_code = status.HTTP_401_UNAUTHORIZED
            return Response(
                {
                    'status': status.HTTP_401_UNAUTHORIZED,
                    'message': "Unauthorized Access",
                }
            )

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
                'message': 'Prescription ' + response_message
            },
        )


class PrescriptionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, input=None, format=None):
        id = input
        if id is not None:
            if Prescription.objects.filter(prescription_id=id).count() >= 1:
                prescription = Prescription.objects.get(prescription_id=id)
                serializer = PrescriptionSerializer(prescription)
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
                        'message': "Prescription " + response_message,
                        'data': serializer.data,
                    }
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
        else:
            appointment_id = request.GET.get('appointment_id')
            print(appointment_id)
            if appointment_id is None:
                prescription = Prescription.objects.all()
                serializer = PrescriptionViewSerializer(
                    prescription, many=True)
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
                        'message': "Prescription " + response_message,
                        'data': serializer.data,
                    }
                )
            else:
                try:
                    
                    prescription = Prescription.objects.filter(appointment_id=appointment_id)
                    print(prescription)
                    serializer = PrescriptionViewSerializer(prescription , many = True)
                    print(serializer.data)
                    response_message = ""
                    response_code = ""
                    try:
                        error = Error.objects.get(
                            error_title='RETRIEVED_SUCCESS')
                        response_message = error.error_message
                        response_code = error.error_code
                        Response.status_code = error.error_code
                    except:
                        response_message = ResponseMessage.RETRIEVED_SUCCESS
                        response_code = status.HTTP_200_OK
                    return Response(
                        {
                            'status': response_code,
                            'message': "Prescription " + response_message,
                            'data': serializer.data,
                        }
                    )
                except:
                    return Response(
                        {
                            'status': status.HTTP_400_BAD_REQUEST,
                            'message': "Prescription Not Found",
                        }
                    )


class PrescriptionUpdate(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, input, format=None):
        id = input
        if Prescription.objects.filter(prescription_id=id).count() >= 1:
            prescription = Prescription.objects.get(prescription_id=id)
            serializer = PrescriptionSerializer(
                prescription, data=request.data, partial=True)
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
                    'message': 'Prescription ' + response_message,
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


class PrescriptionDelete(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, input, format=None):
        id = input
        if Prescription.objects.filter(prescription_id=id).count() >= 1:
            prescripton = Prescription.objects.get(prescription_id=id)
            prescripton.delete()
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
                    'message': "Prescription " + response_message,
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
