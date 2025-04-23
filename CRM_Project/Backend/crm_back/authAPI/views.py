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


class Graphics(generics.GenericAPIView):
    model = None
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        if self.model is None:
            return Response({"error": "Model is not defined."}, status=500)

        user_id = kwargs.get('id') or request.query_params.get('id')
        if not user_id:
            return Response(
                {"error": "User id not provided. Pass it as /.../<id>/ or ?id=<id>."},
                status=400
            )

        try:
            queryset = self.model.objects.filter(user_id=int(user_id))
        except ValueError:
            return Response({"error": "Invalid user id."}, status=400)

        data = [model_to_dict(obj) for obj in queryset]
        return Response(data)

    def post(self, request, *args, **kwargs):

        if self.model is None:
            return Response({"error": "Model is not defined."}, status=500)

        user_id = kwargs.get('id') or request.query_params.get('id')
        if not user_id:
            return Response(
                {"error": "User id not provided. Pass it as /.../<id>/ or ?id=<id>."},
                status=400
            )

        payload = request.data.copy()
        payload['user_id'] = int(user_id)

        try:
            instance = self.model.objects.create(**payload)
        except Exception as e:
            return Response(
                {"error": f"Could not create: {str(e)}"},
                status=400
            )

        return Response(model_to_dict(instance), status=status.HTTP_201_CREATED)

    def delete(self, request, *args, **kwargs):

        if self.model is None:
            return Response({"error": "Model is not defined."}, status=500)

        user_id = kwargs.get('id') or request.query_params.get('id')
        obj_id  = kwargs.get('obj_id') or request.query_params.get('obj_id')
        if not user_id or not obj_id:
            return Response(
                {"error": "Both user id and object id must be provided."},
                status=400
            )

        try:
            inst = self.model.objects.get(pk=int(obj_id), user_id=int(user_id))
        except self.model.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        inst.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class getGraphicsTotalProfit(Graphics):
    model = TotalProfit
    # permission_classes = (IsAuthenticated,)

class getGraphicsActiveClients(Graphics):
    model = ActiveClient
    # permission_classes = (IsAuthenticated,)

# class getGraphicsQuarterlyRevenue(Graphics):
#     model = QuarterlyRevenue

class getGraphicsActiveProjects(Graphics):
    model = ActiveProject
    # permission_classes = (IsAuthenticated,)

# @api_view(['POST'])
# @permission_classes(['AllowAny'])
# def SaveFile(request):
#     if 'uploadedFile' not in request.FILES:
#         return Response({"error": "No file uploaded"}, status=400)
    
#     file = request.FILES['uploadedFile']
#     file_name = default_storage.save(file.name, file)
#     return Response({"filename": file_name})


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