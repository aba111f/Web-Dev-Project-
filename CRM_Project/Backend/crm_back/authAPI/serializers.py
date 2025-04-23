from rest_framework import serializers
from authAPI.models import *

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
        read_only_fields = ('user_id',)