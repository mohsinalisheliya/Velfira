from django.urls import path
from .views import SendOTPView, VerifyOTPView, AdminLoginView, AddressListView, AddressDetailView, ProfileView
from rest_framework_simplejwt.views import TokenRefreshView

app_name = "accounts"

urlpatterns = [
    path("otp/send/", SendOTPView.as_view(), name="otp-send"),
    path("otp/verify/", VerifyOTPView.as_view(), name="otp-verify"),
    path("admin/login/", AdminLoginView.as_view(), name="admin-login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    
    # Profile API (New)
    path("profile/", ProfileView.as_view(), name="profile"),

    # Address APIs
    path("addresses/", AddressListView.as_view(), name="address-list"),
    path("addresses/<int:pk>/", AddressDetailView.as_view(), name="address-detail"),
]
