from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from django.shortcuts import get_object_or_404

from .models import Order
from .serializers import CheckoutSerializer, OrderSerializer, AddressSerializer
from .services import create_order
from apps.accounts.models import Address
from apps.cart.models import Cart


class CheckoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # OTP verified check — mandatory
        if not request.user.mobile_verified:
            return Response(
                {"detail": "Mobile number must be verified before placing an order."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = CheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # address
        if serializer.validated_data.get("address_id"):
            address = get_object_or_404(
                Address, id=serializer.validated_data["address_id"], user=request.user
            )
        else:
            address = Address.objects.create(
                user=request.user,
                **serializer.validated_data["new_address"]
            )

        cart = get_object_or_404(Cart, user=request.user)
        coupon_code = serializer.validated_data.get("coupon_code")

        try:
            order = create_order(request.user, cart, address, coupon_code)
        except ValueError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related("items").order_by("-created_at")


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)



class AdminOrderListView(generics.ListAPIView):
    queryset = Order.objects.select_related("user", "address").prefetch_related("items").order_by("-created_at")
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUser]


class AdminOrderDetailView(generics.RetrieveUpdateAPIView):
    queryset = Order.objects.select_related("user", "address").prefetch_related("items")
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUser]