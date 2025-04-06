from rest_framework import serializers
from authAPI.models import Profile

class SerializerProfile(serializers.ModelSerializer):
    class Meta:
        model=Profile
        fields='__all__'
