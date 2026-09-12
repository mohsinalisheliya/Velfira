from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.crypto import get_random_string
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated

from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator

from .models import User, Address
from .otp import send_otp, verify_otp
from .serializers import SendOTPSerializer, VerifyOTPSerializer, CustomerSerializer, AddressSerializer


@method_decorator(ratelimit(key='ip', rate='5/h', method='POST', block=True), name='post')
class SendOTPView(APIView):
    permission_classes = []
    def post(self, request):
        serializer = SendOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        mobile_number = serializer.validated_data["mobile_number"]
        action = serializer.validated_data["action"]

        user_exists = User.objects.filter(mobile_number=mobile_number).exists()

        # LOGIC: Check conditions before sending OTP
        if action == "login" and not user_exists:
            return Response({"detail": "Account does not exist. Please sign up."}, status=status.HTTP_400_BAD_REQUEST)
        if action == "signup" and user_exists:
            return Response({"detail": "Account already exists. Please login."}, status=status.HTTP_400_BAD_REQUEST)

        send_otp(mobile_number)
        return Response({"detail": "OTP sent."}, status=status.HTTP_200_OK)

class VerifyOTPView(APIView):
    permission_classes = []
    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        mobile_number = serializer.validated_data["mobile_number"]
        otp = serializer.validated_data["otp"]
        action = serializer.validated_data["action"]

        ok, message = verify_otp(mobile_number, otp)
        if not ok:
            return Response({"detail": message}, status=status.HTTP_400_BAD_REQUEST)

        if action == "signup":
            first_name = serializer.validated_data.get("first_name", "")
            last_name = serializer.validated_data.get("last_name", "")
            email = serializer.validated_data.get("email", "")

            user, created = User.objects.get_or_create(
                mobile_number=mobile_number,
                defaults={
                    "username": f"cust_{mobile_number}_{get_random_string(4)}",
                    "first_name": first_name,
                    "last_name": last_name,
                    "email": email
                },
            )
        else:
            # Login action: Safe because existence was checked at send_otp
            user = User.objects.get(mobile_number=mobile_number)

        user.mobile_verified = True
        user.save()

        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": CustomerSerializer(user).data,
            "created": action == "signup",
        })

class AdminLoginView(APIView):
    permission_classes = []
    def post(self, request):
        user = authenticate(request, username=request.data.get("username"), password=request.data.get("password"))
        if not user:
            return Response({"detail": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)
        if not user.is_staff:
            return Response({"detail": "Admin access only."}, status=status.HTTP_403_FORBIDDEN)
        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "username": user.username,
            "is_staff": user.is_staff,
        })

class AddressListView(generics.ListCreateAPIView):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
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

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Ye hamesha logged-in user ki details hi return/update karega
        return self.request.user
