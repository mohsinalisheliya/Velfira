from django.urls import path
from .views import SendOTPView, VerifyOTPView

app_name = "accounts"

urlpatterns = [
    path("otp/send/", SendOTPView.as_view(), name="otp-send"),
    path("otp/verify/", VerifyOTPView.as_view(), name="otp-verify"),
]