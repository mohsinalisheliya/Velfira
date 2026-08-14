from rest_framework import serializers
from .models import Cart, CartItem
from apps.catalog.serializers import ProductListSerializer, ProductVariantSerializer


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    variant = ProductVariantSerializer(read_only=True)
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ["id", "product", "variant", "quantity", "subtotal"]

    def get_subtotal(self, obj):
        if obj.variant:
            price = obj.variant.effective_price()
        else:
            price = obj.product.price
        return float(price) * obj.quantity


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.SerializerMethodField()
    item_count = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ["id", "items", "item_count", "total"]

    def get_total(self, obj):
        return sum(float(item.product.price) * item.quantity for item in obj.items.all())

    def get_item_count(self, obj):
        return obj.items.count()


class AddToCartSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    variant_id = serializers.IntegerField(required=False, allow_null=True)
    quantity = serializers.IntegerField(min_value=1, default=1)


class UpdateCartItemSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(min_value=1)


class RemoveFromCartSerializer(serializers.Serializer):
    item_id = serializers.IntegerField()