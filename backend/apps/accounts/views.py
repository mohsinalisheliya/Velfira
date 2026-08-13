from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.crypto import get_random_string

from .models import *
from .otp import send_otp, verify_otp
from .serializers import SendOTPSerializer, VerifyOTPSerializer, CustomerSerializer


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

        ok, message = verify_otp(mobile_number, otp)
        if not ok:
            return Response({"detail": message}, status=status.HTTP_400_BAD_REQUEST)

        # get or create the customer account tied to this mobile number
        user, created = User.objects.get_or_create(
            mobile_number=mobile_number,
            defaults={"username": f"cust_{mobile_number}_{get_random_string(4)}"},
        )
        user.mobile_verified = True
        user.save(update_fields=["mobile_verified"])

        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": CustomerSerializer(user).data,
            "created": created,
        })