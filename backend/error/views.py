from rest_framework.pagination import PageNumberPagination
from error.serializers import ErrorSerializer
from rest_framework.generics import GenericAPIView
from rest_framework.generics import ListAPIView
from rest_framework.filters import SearchFilter
from rest_framework.response import Response
from rest_framework.views import APIView
from error.models import Error
from rest_framework import status


class ErrorRegister(GenericAPIView):
    serializer_class = ErrorSerializer

    def post(self, request, format = None):
        serializer = ErrorSerializer(data = request.data)
        serializer.is_valid(raise_exception = True)
        serializer.save()
        return Response(
            {
                'status': status.HTTP_201_CREATED,
                'message': 'Error Successfully Registered'
            },
        )
    