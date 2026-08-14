from django.utils import timezone
from .models import Coupon


def validate_coupon(code, order_subtotal):
    try:
        coupon = Coupon.objects.get(code=code.upper(), is_active=True)
    except Coupon.DoesNotExist:
        return None, "Invalid coupon code."

    now = timezone.now()
    if now < coupon.valid_from or now > coupon.valid_to:
        return None, "Coupon has expired."

    if coupon.usage_limit > 0 and coupon.times_used >= coupon.usage_limit:
        return None, "Coupon usage limit reached."

    if order_subtotal < coupon.min_order_value:
        return None, f"Minimum order value is ₹{coupon.min_order_value}."

    return coupon, "Valid."


def calculate_discount(coupon, subtotal):
    if coupon.discount_type == "flat":
        return min(coupon.value, subtotal)
    elif coupon.discount_type == "percent":
        return round((coupon.value / 100) * subtotal, 2)
    return 0