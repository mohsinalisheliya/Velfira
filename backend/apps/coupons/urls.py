from django.urls import path
from .views import ApplyCouponView

app_name = "coupons"

urlpatterns = [
    path("coupons/apply/", ApplyCouponView.as_view(), name="coupon-apply"),
]