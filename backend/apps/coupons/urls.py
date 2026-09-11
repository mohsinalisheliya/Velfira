from django.urls import path
from .views import *

app_name = "coupons"

urlpatterns = [
    path("coupons/apply/", ApplyCouponView.as_view(), name="coupon-apply"),
    path("admin/coupons/", AdminCouponListCreateView.as_view(), name="admin-coupon-list"),
path("admin/coupons/<int:pk>/", AdminCouponDetailView.as_view(), name="admin-coupon-detail"),
]