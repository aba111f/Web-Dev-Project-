from django.forms import model_to_dict
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from django.core.files.storage import default_storage
from rest_framework import generics
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



# Create your views here.
# @api_view(['POST'])
class DataProfile(generics.CreateAPIView):
    queryset = Profile.objects.all()
    serializer_class = SerializerProfile
    # permission_classes = (IsAuthenticated,)

class getUser(generics.RetrieveUpdateDestroyAPIView):
    queryset = Profile.objects.all()
    serializer_class=SerializerProfile
    lookup_field="id"
    permission_classes = (IsAuthenticated,)


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

# class getGraphicsQuarterlyRevenue(Graphics):
#     model = QuarterlyRevenue

class getGraphicsActiveProjects(Graphics):
    model = ActiveProject

@api_view(['POST'])
# @permission_classes(['AllowAny'])
def SaveFile(request):
    if 'uploadedFile' not in request.FILES:
        return Response({"error": "No file uploaded"}, status=400)
    
    file = request.FILES['uploadedFile']
    file_name = default_storage.save(file.name, file)
    return Response({"filename": file_name})


class CustomLoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        try:
            user = Profile.objects.get(username=username)
            if user.password == password:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user_id'       : user.id,
                    'username'      : user.username,
                    'FirstName'     : user.FirstName,
                    'LastName'      : user.LastName,
                    'password'      : user.password,
                    'mail'          : user.mail,
                    'phone_num'     : user.phone_num,
                    'age'           : user.age,
                    'PhotoFileName' : user.PhotoFileName,
                    'BussinesName'  : user.BussinesName,
                    'logoName'      : user.logoName,
                })
            else:
                return Response({'detail': 'Invalid password'}, status=status.HTTP_401_UNAUTHORIZED)
        except Profile.DoesNotExist:
            return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)