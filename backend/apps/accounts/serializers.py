from rest_framework import serializers
from .models import User

class SendOTPSerializer(serializers.Serializer):
    mobile_number = serializers.CharField(max_length=15)

class VerifyOTPSerializer(serializers.Serializer):
    mobile_number = serializers.CharField(max_length=15)
    otp = serializers.CharField(max_length=6)
    # Naye fields add kiye hain signup ke liye
    first_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "mobile_number", "mobile_verified", "email", "first_name", "last_name"]
