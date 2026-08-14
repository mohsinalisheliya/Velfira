from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .serializers import ApplyCouponSerializer
from .validators import validate_coupon, calculate_discount


class ApplyCouponView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ApplyCouponSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        code = serializer.validated_data["code"]
        subtotal = serializer.validated_data["subtotal"]

        coupon, message = validate_coupon(code, subtotal)
        if not coupon:
            return Response({"detail": message}, status=status.HTTP_400_BAD_REQUEST)

        discount = calculate_discount(coupon, subtotal)
        return Response({
            "code": coupon.code,
            "discount_type": coupon.discount_type,
            "discount_amount": discount,
            "message": message,
        })