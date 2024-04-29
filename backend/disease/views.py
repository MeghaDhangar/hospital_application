from disease.models import Disease
from disease.serializers import DiseaseSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.generics import GenericAPIView
from error.models import Error
from hospital_management.responses import ResponseMessage
from rest_framework.permissions import IsAuthenticated
from user.models import User
import jwt
from drf_yasg.utils import swagger_auto_schema
from hospital_management.logger import logger
from datetime import datetime


current_datetime = datetime.now()
current_timestamp = current_datetime.strftime('%Y-%m-%d %H:%M:%S')


class DiseaseAdd(GenericAPIView):
    serializer_class = DiseaseSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        disease_name = request.data.get('disease_name')
        if Disease.objects.filter(disease_name=disease_name).count() >= 1:
            try:
                error = Error.objects.get(error_title='ALREADY_REGISTERED')
                response_message = error.error_message
                response_code = error.error_code
                Response.status_code = error.error_code

                header_value = request.headers['Authorization']
                token = header_value.split(' ')[1]
                payload = jwt.decode(token, "secret", algorithms=['HS256'])
                user_id = payload['user_id']
                user = User.objects.get(user_id=user_id)
                user_role = user.user_role

                if user_role == "Patient":
                    Response.status_code = status.HTTP_401_UNAUTHORIZED
                    logger.warning({
                        'timestamp': current_timestamp,
                        'method': request.method,
                        'path': request.path,
                        'status': status.HTTP_401_UNAUTHORIZED,
                        'message': "Unauthorized Access",
                        'email': user.user_email,
                    })
                    return Response(
                        {
                            'status': status.HTTP_401_UNAUTHORIZED,
                            'message': "Unauthorized Access",
                        }
                    )

                if user_role == "Doctor":
                    Response.status_code = status.HTTP_401_UNAUTHORIZED
                    logger.warning({
                        'timestamp': current_timestamp,
                        'method': request.method,
                        'path': request.path,
                        'status': status.HTTP_401_UNAUTHORIZED,
                        'message': "Unauthorized Access",
                        'email': user.user_email,
                    })
                    return Response(
                        {
                            'status': status.HTTP_401_UNAUTHORIZED,
                            'message': "Unauthorized Access",
                        }
                    )

            except:
                response_message = ResponseMessage.ALREADY_REGISTERED
                response_code = status.HTTP_400_BAD_REQUEST
            logger.warning({
                'timestamp': current_timestamp,
                'method': request.method,
                'path': request.path,
                'status': response_code,
                'message': 'Disease ' + response_message,
                'email': user.user_email,
            })
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
            header_value = request.headers['Authorization']
            token = header_value.split(' ')[1]
            payload = jwt.decode(token, "secret", algorithms=['HS256'])
            user_id = payload['user_id']
            user = User.objects.get(user_id=user_id)
            user_role = user.user_role
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
                'message': 'Disease ' + response_message,
                'email': user.user_email,
            })
            return Response(
                {
                    'status': response_code,
                    'message': 'Disease ' + response_message
                },
            )


class DiseaseUpdate(APIView):
    permission_classes = [IsAuthenticated]

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

            if user_role == "Doctor":
                Response.status_code = status.HTTP_401_UNAUTHORIZED
                return Response(
                    {
                        'status': status.HTTP_401_UNAUTHORIZED,
                        'message': "Unauthorized Access",
                    }
                )

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

            if user_role == "Doctor":
                Response.status_code = status.HTTP_401_UNAUTHORIZED
                return Response(
                    {
                        'status': status.HTTP_401_UNAUTHORIZED,
                        'message': "Unauthorized Access",
                    }
                )

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
    permission_classes = [IsAuthenticated]

    def delete(self, request, input, format=None):
        id = input
        if Disease.objects.filter(disease_id=id).count() >= 1:
            disease = Disease.objects.get(disease_id=id)
            disease.delete()
            response_message = ""
            response_code = ""

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
    @swagger_auto_schema(security=[])
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
                logger.info({
                    'timestamp': current_timestamp,
                    'method': request.method,
                    'path': request.path,
                    'status': response_code,
                    'message': 'Disease ' + response_message,
                })
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
                logger.info({
                    'timestamp': current_timestamp,
                    'method': request.method,
                    'path': request.path,
                    'status': response_code,
                    'message': response_message,
                })
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
            logger.info({
                'timestamp': current_timestamp,
                'method': request.method,
                'path': request.path,
                'status': response_code,
                'message': 'Disease ' + response_message,
            })
            return Response(
                {
                    'status': response_code,
                    'message': "Disease " + response_message,
                    'data': serializer.data
                },
            )
