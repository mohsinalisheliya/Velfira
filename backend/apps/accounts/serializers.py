from rest_framework import serializers
from .models import User, Address

class SendOTPSerializer(serializers.Serializer):
    mobile_number = serializers.CharField(max_length=15)
    action = serializers.ChoiceField(choices=["login", "signup"])

class VerifyOTPSerializer(serializers.Serializer):
    mobile_number = serializers.CharField(max_length=15)
    otp = serializers.CharField(max_length=6)
    action = serializers.ChoiceField(choices=["login", "signup"])
    first_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "mobile_number", "mobile_verified", "email", "first_name", "last_name"]

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ["id", "full_name", "mobile_number", "flat", "area", "landmark", "city", "state", "pincode", "is_default"]