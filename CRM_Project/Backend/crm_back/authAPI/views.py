from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from django.core.files.storage import default_storage
from rest_framework import generics
from .serializers import *
from .models import *
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.http import JsonResponse

# Create your views here.
# @api_view(['POST'])
class DataProfile(generics.CreateAPIView):
    queryset = Profile.objects.all()
    serializer_class = SerializerProfile

class getUser(generics.RetrieveUpdateDestroyAPIView):
    queryset = Profile.objects.all()
    serializer_class=SerializerProfile
    lookup_field="id"

class Graphics(generics.GenericAPIView):
    model = None

    def get(self, request):
        if self.model is None:
            return Response({"error": "Model is not defined."}, status=500)
        
        queryset = self.model.objects.all()
        data = [model_to_dict(obj) for obj in queryset]
        return Response(data)


class getGraphicsTotalProfit(Graphics):
    model = TotalProfit

class getGraphicsActiveClients(Graphics):
    model = ActiveClient

class getGraphicsQuarterlyRevenue(Graphics):
    model = QuarterlyRevenue

class getGraphicsActiveProjects(Graphics):
    model = ActiveProject


def LogIn(self, request,email,password):
    if request.method=="POST":
        email = request.data.get("email")
        password = request.data.get("password")

        user = authenticate(email=email, password=password)
        if user:
            return JsonResponse({"message": "Login successful", "user_id": user.id},safe=False, status=201)
        else:
            return JsonResponse({"error": "Invalid credentials"}, status=500,safe=False)
    
# class LogIn(generics.GenericAPIView):
#     def post(self, request,email,password):
#         # return JsonResponse("BLABLABLA",status=5000)
#         email = request.data.get("email")
#         password = request.data.get("password")

#         user = authenticate(username=email, password=password)
#         if user:
#             return JsonResponse({"message": "Login successful", "user_id": user.id})
#         else:
#             return JsonResponse({"error": "Invalid credentials"}, status=400)
            
        