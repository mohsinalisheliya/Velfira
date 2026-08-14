from decimal import Decimal
from apps.catalog.models import Product, ProductVariant
from apps.coupons.validators import validate_coupon, calculate_discount
from .models import Order, OrderItem


def create_order(user, cart, address, coupon_code=None):
    """
    Creates an order from the cart.
    User must have mobile_verified=True before calling this.
    """
    if not user.mobile_verified:
        raise ValueError("Mobile number must be verified before placing an order.")

    items = cart.items.select_related("product", "variant").all()
    if not items.exists():
        raise ValueError("Cart is empty.")

    subtotal = Decimal("0.00")
    gst_total = Decimal("0.00")

    for item in items:
        if item.variant:
            price = item.variant.effective_price()
        else:
            price = item.product.price

        item_subtotal = price * item.quantity
        item_gst = item_subtotal * (item.product.gst_rate / 100)
        subtotal += item_subtotal
        gst_total += item_gst

    discount = Decimal("0.00")
    coupon = None
    if coupon_code:
        coupon, message = validate_coupon(coupon_code, subtotal)
        if coupon:
            discount = Decimal(str(calculate_discount(coupon, subtotal)))

    total = subtotal + gst_total - discount

    order = Order.objects.create(
        user=user,
        address=address,
        subtotal=subtotal,
        gst_amount=gst_total,
        discount_amount=discount,
        total=total,
        coupon=coupon,
        payment_status="pending",
    )

    for item in items:
        if item.variant:
            price = item.variant.effective_price()
        else:
            price = item.product.price

        OrderItem.objects.create(
            order=order,
            product=item.product,
            variant=item.variant,
            quantity=item.quantity,
            unit_price=price,
            gst_rate_snapshot=item.product.gst_rate,
        )

    if coupon:
        coupon.times_used += 1
        coupon.save(update_fields=["times_used"])

    cart.items.all().delete()

    return order