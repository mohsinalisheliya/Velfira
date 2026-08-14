from rest_framework import serializers
from .models import Coupon


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = ["code", "discount_type", "value", "min_order_value", "valid_from", "valid_to"]


class ApplyCouponSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=30)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2)