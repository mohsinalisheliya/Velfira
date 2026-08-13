from rest_framework import serializers
from .models import User


class SendOTPSerializer(serializers.Serializer):
    mobile_number = serializers.CharField(max_length=15)


class VerifyOTPSerializer(serializers.Serializer):
    mobile_number = serializers.CharField(max_length=15)
    otp = serializers.CharField(max_length=6)


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "mobile_number", "mobile_verified", "email", "first_name", "last_name"]