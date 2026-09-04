from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.crypto import get_random_string
from .models import *
from .otp import send_otp, verify_otp
from .serializers import SendOTPSerializer, VerifyOTPSerializer, CustomerSerializer
from django.contrib.auth import authenticate

class SendOTPView(APIView):
    permission_classes = []  # public endpoint
    def post(self, request):
        serializer = SendOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        mobile_number = serializer.validated_data["mobile_number"]
        send_otp(mobile_number)
        return Response({"detail": "OTP sent."}, status=status.HTTP_200_OK)

class VerifyOTPView(APIView):
    permission_classes = []  # public endpoint
    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        mobile_number = serializer.validated_data["mobile_number"]
        otp = serializer.validated_data["otp"]
        first_name = serializer.validated_data.get("first_name", "")
        last_name = serializer.validated_data.get("last_name", "")
        email = serializer.validated_data.get("email", "")

        ok, message = verify_otp(mobile_number, otp)
        if not ok:
            return Response({"detail": message}, status=status.HTTP_400_BAD_REQUEST)

        # get or create the customer account tied to this mobile number
        user, created = User.objects.get_or_create(
            mobile_number=mobile_number,
            defaults={
                "username": f"cust_{mobile_number}_{get_random_string(4)}",
                "first_name": first_name,
                "last_name": last_name,
                "email": email
            },
        )
        
        # Agar user existing hai par name update kar raha hai
        if not created and (first_name or last_name or email):
            if first_name: user.first_name = first_name
            if last_name: user.last_name = last_name
            if email: user.email = email

        user.mobile_verified = True
        user.save()

        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": CustomerSerializer(user).data,
            "created": created,
        })

class AdminLoginView(APIView):
    permission_classes = []
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(request, username=username, password=password)
        if not user:
            return Response(
                {"detail": "Invalid credentials."},
                status=status.HTTP_401_UNAUTHORIZED
            )
        if not user.is_staff:
            return Response(
                {"detail": "Admin access only."},
                status=status.HTTP_403_FORBIDDEN
            )
        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "username": user.username,
            "is_staff": user.is_staff,
        })
