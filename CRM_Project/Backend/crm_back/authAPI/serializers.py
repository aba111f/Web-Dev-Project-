from rest_framework import serializers
from authAPI.models import Profile

class SerializerProfile(serializers.ModelSerializer):
    class Meta:
        model=Profile
        fields='__all__'
    
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