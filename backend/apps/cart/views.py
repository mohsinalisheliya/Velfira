from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem
from .serializers import CartSerializer, AddToCartSerializer, UpdateCartItemSerializer, RemoveFromCartSerializer
from apps.catalog.models import Product, ProductVariant

class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get_cart(self, user):
        cart, created = Cart.objects.get_or_create(user=user)
        return cart

    def get(self, request):
        cart = self.get_cart(request.user)
        # Fix: Passed request context so DRF can build full absolute Image URLs
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        product_id = serializer.validated_data["product_id"]
        variant_id = serializer.validated_data.get("variant_id")
        quantity = serializer.validated_data["quantity"]
        
        product = get_object_or_404(Product, id=product_id, is_active=True)
        variant = None
        if variant_id:
            variant = get_object_or_404(ProductVariant, id=variant_id, product=product)
            
        cart = self.get_cart(request.user)
        item, created = CartItem.objects.get_or_create(
            cart=cart, product=product, variant=variant,
            defaults={"quantity": quantity}
        )
        if not created:
            item.quantity += quantity
            item.save()
            
        return Response(CartSerializer(cart, context={'request': request}).data, status=status.HTTP_201_CREATED)

class CartItemDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, item_id):
        serializer = UpdateCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        item = get_object_or_404(CartItem, id=item_id, cart__user=request.user)
        item.quantity = serializer.validated_data["quantity"]
        item.save()
        cart = item.cart
        return Response(CartSerializer(cart, context={'request': request}).data)

    def delete(self, request, item_id):
        item = get_object_or_404(CartItem, id=item_id, cart__user=request.user)
        cart = item.cart
        item.delete()
        return Response(CartSerializer(cart, context={'request': request}).data)
