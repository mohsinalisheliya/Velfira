from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.crypto import get_random_string

from apps.orders.serializers import AddressSerializer
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
    permission_classes = []

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        mobile_number = serializer.validated_data["mobile_number"]
        otp = serializer.validated_data["otp"]
        first_name = serializer.validated_data.get("first_name", "").strip()
        last_name = serializer.validated_data.get("last_name", "").strip()
        email = serializer.validated_data.get("email", "").strip()

        ok, message = verify_otp(mobile_number, otp)
        if not ok:
            return Response({"detail": message}, status=status.HTTP_400_BAD_REQUEST)

        existing_user = User.objects.filter(mobile_number=mobile_number).first()

        if existing_user is None:
            # Brand new number — name is COMPULSORY, no matter which tab/flow was used.
            if not first_name or not last_name:
                return Response(
                    {"detail": "This number isn't registered yet. Please sign up with your name to continue."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            user = User.objects.create(
                mobile_number=mobile_number,
                username=f"cust_{mobile_number}_{get_random_string(4)}",
                first_name=first_name,
                last_name=last_name,
                email=email,
            )
            created = True
        else:
            # Existing user — NEVER touch their saved name/email again, ignore whatever was sent.
            user = existing_user
            created = False

        user.mobile_verified = True
        user.save(update_fields=["mobile_verified"])

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

# apps/accounts/views.py mein import kar
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

# Aur ye class add kar de:
class AddressListView(generics.ListCreateAPIView):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Address
from .serializers import AddressSerializer

class AddressListView(generics.ListCreateAPIView):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Agar is_default True hai, toh baaki sab ko False kar do
        if serializer.validated_data.get('is_default', False):
            Address.objects.filter(user=self.request.user).update(is_default=False)
        serializer.save(user=self.request.user)

class AddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_update(self, serializer):
        if serializer.validated_data.get('is_default', False):
            Address.objects.filter(user=self.request.user).update(is_default=False)
        serializer.save()
