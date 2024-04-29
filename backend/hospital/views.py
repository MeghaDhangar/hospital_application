from rest_framework.response import Response
from .serializers import HospitalSerializer
from rest_framework import status
from user.serializers import UserRegisterSerializer
from rest_framework.views import APIView
from .models import Hospital
from user.models import User
from rest_framework.generics import GenericAPIView
from hospital_management.responses import ResponseMessage
from error.models import Error
from hospital_management.responses import ResponseMessage

class HospitalRegister(GenericAPIView):
   serializer_class = HospitalSerializer

   def post(self, request, format = None):
      if Hospital.objects.filter(hospital_email = request.data.get('hospital_email')).count() >= 1:
            try:
             error = Error.objects.get(error_title = 'ALREADY_REGISTERED')
             response_message = error.error_message
             response_code = error.error_code
             Response.status_code = error.error_code
            except:
               response_message = ResponseMessage.ALREADY_REGISTERED
               response_code = status.HTTP_400_BAD_REQUEST
            return Response(
               {
                  'status': response_code,
                  'message': 'Hospital ' + response_message
               },
            )
      else:
         if request.data.get('hospital_email') == request.data.get('hospital_owner_email'):
            try:
             error = Error.objects.get(error_title = 'HOSPITAL_SAME_EMAIL')
             response_message = error.error_message
             response_code = error.error_code
             Response.status_code = error.error_code
            except:
               response_message = ResponseMessage.HOSPITAL_SAME_EMAIL
               response_code = status.HTTP_400_BAD_REQUEST
            return Response(
               {
                  'status': response_code,
                  'message': response_message
               },
            )
         else:   
            serializer = HospitalSerializer(data = request.data)
            serializer.is_valid(raise_exception = True)
            serializer.save()
            hospital = Hospital.objects.get(hospital_email = request.data.get('hospital_email'))

            member = hospital.hospital_id
            user_name = hospital.username
            user_email = request.data.get('hospital_owner_email')
            user_password = request.data.get('password')
            user_role = "Admin"

            user = User.objects.create_superuser(member, user_name, user_email, user_role, user_password)
            response_message = ""
            response_code=""
            try:
             error = Error.objects.get(error_title = 'REGISTRATION_SUCCESS')
             response_message = error.error_message
             response_code = error.error_code
             Response.status_code = error.error_code
            except:
               response_message = ResponseMessage.REGISTRATION_SUCCESS
               response_code = status.HTTP_201_CREATED

            return Response(
               {
                  'status': response_code,
                  'message': 'Hospital ' + response_message
               },
            )
   
class HospitalView(APIView):
   def get(self, request, input = None, format = None):
      id = input
      print(id)
      if id is not None :
         if Hospital.objects.filter(hospital_id = id).count() >= 1:
            hospital = Hospital.objects.get(hospital_id = id)
            serializer = HospitalSerializer(hospital)
            response_message = ""
            response_code=""
            try:
             error = Error.objects.get(error_title = 'RETRIEVED_SUCCESS')
             response_message = error.error_message
             response_code = error.error_code
             Response.status_code = error.error_code
            except:
                   response_message = ResponseMessage.RETRIEVED_SUCCESS
                   response_code = status.HTTP_200_OK
            return Response(
               {
                  'status': response_code,
                  'message': 'Hospital ' + response_message,
                  'data': serializer.data
               },
            )
         else:  
            response_message = ""
            response_code=""
            try:
             error = Error.objects.get(error_title = 'INVALID_ID')
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
         hospital = Hospital.objects.all()
         serializer = HospitalSerializer(hospital, many = True)
         response_message = ""
         response_code=""
         try:
          error = Error.objects.get(error_title = 'RETRIEVED_SUCCESS')
          response_message = error.error_message
          response_code = error.error_code
          Response.status_code = error.error_code
         except:
            response_message = ResponseMessage.RETRIEVED_SUCCESS
            response_code = status.HTTP_200_OK
         return Response(
            {
               'status': response_code,
               'message': 'Hospital ' + response_message,
               'data': serializer.data
            },
         )
      
class HospitalUpdate(APIView):
   def patch(self, request, input, format = None):
      id = input
      if Hospital.objects.filter(hospital_id = id).count() >= 1:
         hospital = Hospital.objects.get(hospital_id = id)
         serializer = HospitalSerializer(hospital, data = request.data, partial = True)
         serializer.is_valid(raise_exception = True)
         serializer.save() 
         response_message = ""
         response_code=""
         try:
          error = Error.objects.get(error_title = 'UPDATE_SUCCESS')
          response_message = error.error_message
          response_code = error.error_code
          Response.status_code = error.error_code
         except:
            response_message = ResponseMessage.UPDATE_SUCCESS
            response_code = status.HTTP_200_OK
         return Response(
            {
               'status': status.HTTP_200_OK,
               'message': 'Hospital ' + response_message,
            }, 
         )
      else:
          response_message = ""
          response_code=""
          try:
           error = Error.objects.get(error_title = 'INVALID_ID')
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
   
class HospitalDelete(APIView):
   def delete(self, request, input, format = None):
      id = input
      if Hospital.objects.filter(hospital_id = id).count() >= 1:
         hospital=Hospital.objects.get(hospital_id = id)
         hospital.delete()
         response_message = ""
         response_code=""
         try:
          error = Error.objects.get(error_title = 'DELETE_SUCCESS')
          response_message = error.error_message
          response_code = error.error_code
          Response.status_code = error.error_code
         except: 
            response_message = ResponseMessage.DELETE_SUCCESS
            response_code = status.HTTP_200_OK
         return Response(
            {
               'status': response_code,
               'message': 'Hospital ' + response_message,
            },
         )  
      else:  
         response_message = ""
         response_code=""
         try:
          error = Error.objects.get(error_title = 'INVALID_ID')
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