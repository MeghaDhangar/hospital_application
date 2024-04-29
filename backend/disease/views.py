from disease.models import Disease
from disease.serializers import DiseaseSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.generics import GenericAPIView
from error.models import Error
from hospital_management.responses import ResponseMessage


class DiseaseAdd(GenericAPIView):
    serializer_class = DiseaseSerializer

    def post(self, request, format=None):
        disease_name = request.data.get('disease_name')
        if Disease.objects.filter(disease_name=disease_name).count() >= 1:
            try:
                error = Error.objects.get(error_title='ALREADY_REGISTERED')
                response_message = error.error_message
                response_code = error.error_code
                Response.status_code = error.error_code
            except:
                response_message = ResponseMessage.ALREADY_REGISTERED
                response_code = status.HTTP_400_BAD_REQUEST
            return Response(
                {
                    'status': response_code,
                    'message': 'Disease ' + response_message
                },
            )
        else:
            serializer = DiseaseSerializer(data=request.data)
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
                    'message': 'Disease ' + response_message
                },
            )


class DiseaseUpdate(APIView):

    def patch(self, request, input, format=None):
        id = input
        if Disease.objects.filter(disease_id=id).count() >= 1:
            disease = Disease.objects.get(disease_id=id)
            serializer = DiseaseSerializer(
                disease, data=request.data, partial=True)
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
                    'message': 'Disease ' + response_message,
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


class DiseaseDelete(APIView):
    def delete(self, request, input, format=None):
        id = input
        if Disease.objects.filter(disease_id=id).count() >= 1:
            disease = Disease.objects.get(disease_id=id)
            disease.delete()
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
                    'message': "Disease " + response_message,
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


class DiseaseView(APIView):
    def get(self, request, input=None, format=None):
        id = input
        if id is not None:
            if Disease.objects.filter(disease_id=id).count() >= 1:
                disease = Disease.objects.get(disease_id=id)
                serializer = DiseaseSerializer(disease)
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
                        'message': 'Disease ' + response_message,
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
        else:
            disease = Disease.objects.all()
            serializer = DiseaseSerializer(disease, many=True)
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
                    'message': "Disese " + response_message,
                    'data': serializer.data
                },
            )
