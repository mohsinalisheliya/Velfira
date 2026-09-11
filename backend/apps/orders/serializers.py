from rest_framework import serializers
from .models import Order, OrderItem
from apps.accounts.models import Address


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ["id", "full_name", "mobile_number", "flat", "area", "landmark", "city", "state", "pincode", "is_default"]
        

class OrderItemSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(source="product.id")
    product_name = serializers.CharField(source="product.name")
    product_slug = serializers.CharField(source="product.slug")
    product_image = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ["id", "product_id", "product_name", "product_slug", "product_image", "quantity", "unit_price", "gst_rate_snapshot"]

    def get_product_image(self, obj):
        first = obj.product.images.first()
        if first:
            request = self.context.get("request")
            return request.build_absolute_uri(first.image.url) if request else first.image.url
        return None

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    address = AddressSerializer(read_only=True)
    user_mobile = serializers.CharField(source="user.mobile_number", read_only=True)

    class Meta:
        model = Order
        fields = [
            "id", "status", "payment_status",
            "subtotal", "gst_amount", "discount_amount", "total",
            "address", "items", "created_at", "user_mobile"
        ]


class CheckoutSerializer(serializers.Serializer):
    address_id = serializers.IntegerField(required=False)
    new_address = AddressSerializer(required=False)
    coupon_code = serializers.CharField(required=False, allow_blank=True)

    def validate(self, data):
        if not data.get("address_id") and not data.get("new_address"):
            raise serializers.ValidationError("Provide address_id or new_address.")
        return data