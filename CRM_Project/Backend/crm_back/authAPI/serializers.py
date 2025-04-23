from rest_framework import serializers
from authAPI.models import *
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from rest_framework import serializers

class SerializerProfile(serializers.ModelSerializer):
    class Meta:
        model=Profile
        extra_kwargs = {
            'password': {'write_only': True, 'required': False}
        }
        exclude = ['is_active', 'is_staff', 'groups', 'user_permissions']
    
    def validate_username(self, value):
        if Profile.objects.filter(username=value).exists():
            raise serializers.ValidationError("Пользователь с таким именем уже существует.")
        return value
    
    def validate_mail(self, value):
        if Profile.objects.filter(mail=value).exists():
            raise serializers.ValidationError("Пользователь с такой почтой уже существует.")
        return value
    
    def validate_phone_num(self, value):
        if Profile.objects.filter(phone_num=value).exists():
            raise serializers.ValidationError("Пользователь с таким телефоном уже существует.")
        return value
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = Profile.objects.create_user(
            password=password,
            **validated_data
        )
        return user
    
class SerializerEmployee(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'


class TotalProfitSerializer(serializers.ModelSerializer):
    class Meta:
        model = TotalProfit
        fields = '__all__'

class ActiveClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActiveClient
        fields = '__all__'

class ActiveProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActiveProject
        fields = '__all__'


class CustomTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        try:
            data = super().validate(attrs)
            refresh = RefreshToken(attrs['refresh'])

            # Проверка, существует ли пользователь
            user_id = refresh.payload.get('user_id')
            user_model = get_user_model()
            if not user_model.objects.filter(id=user_id).exists():
                raise InvalidToken('User no longer exists.')

            return data
        except TokenError as e:
            raise InvalidToken(e.args[0])