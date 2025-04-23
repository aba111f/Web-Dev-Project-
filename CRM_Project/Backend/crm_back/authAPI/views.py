from django.forms import model_to_dict
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from django.core.files.storage import default_storage
from rest_framework import generics, permissions
from .serializers import *
from .models import *
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from django.contrib.auth.hashers import check_password
from .models import Profile
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

# Create your views here.
# @api_view(['POST'])
class ListProfile(generics.CreateAPIView):
    queryset = Profile.objects.all()
    serializer_class = SerializerProfile
    permission_classes = (IsAuthenticated,)

class actionsWithProfile(generics.RetrieveUpdateDestroyAPIView):
    queryset = Profile.objects.all()
    serializer_class=SerializerProfile
    lookup_field="id"
    permission_classes = (IsAuthenticated,)



class CustomLoginView(APIView):
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        try:
            user = Profile.objects.get(username=username)
            if authenticate(username=username, password=password)is not None:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user_id': user.id
                })
            else:
                return Response({'detail': 'Invalid password'}, status=status.HTTP_401_UNAUTHORIZED)
        except Profile.DoesNotExist:
            return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        

class EmployeeList(generics.ListCreateAPIView):
    serializer_class = SerializerEmployee
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Employee.objects.filter(user_id=user_id)

    def perform_create(self, serializer):
        user_id = self.kwargs['user_id']
        serializer.save(user_id_id=user_id)


class EmployeeActions(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SerializerEmployee
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Employee.objects.filter(user_id=user_id)
    



# TotalProfit
class TotalProfitListCreate(generics.ListCreateAPIView):
    serializer_class = TotalProfitSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return TotalProfit.objects.filter(user_id_id=user_id)

    def perform_create(self, serializer):
        serializer.save(user_id_id=self.kwargs['user_id'])

class TotalProfitDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = TotalProfit.objects.all()
    serializer_class = TotalProfitSerializer

# ActiveClient
class ActiveClientListCreate(generics.ListCreateAPIView):
    serializer_class = ActiveClientSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return ActiveClient.objects.filter(user_id_id=user_id)

    def perform_create(self, serializer):
        serializer.save(user_id_id=self.kwargs['user_id'])

class ActiveClientDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = ActiveClient.objects.all()
    serializer_class = ActiveClientSerializer

# ActiveProject
class ActiveProjectListCreate(generics.ListCreateAPIView):
    serializer_class = ActiveProjectSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return ActiveProject.objects.filter(user_id_id=user_id)

    def perform_create(self, serializer):
        serializer.save(user_id_id=self.kwargs['user_id'])

class ActiveProjectDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = ActiveProject.objects.all()
    serializer_class = ActiveProjectSerializer
