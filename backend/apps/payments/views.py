from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from .gateway_mock import get_gateway
from .models import Payment
from apps.orders.models import Order
from apps.invoices.generator import generate_invoice


class InitiatePaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, order_id):
        order = get_object_or_404(Order, id=order_id, user=request.user)

        if order.payment_status == "paid":
            return Response({"detail": "Order already paid."}, status=status.HTTP_400_BAD_REQUEST)

        gateway = get_gateway()
        result = gateway.initiate(order)

        payment = Payment.objects.create(
            order=order,
            gateway=result["gateway"],
            gateway_txn_id=result["gateway_txn_id"],
            amount=order.total,
            status="success" if result["status"] == "success" else "failed",
            raw_response=result,
        )

        if payment.status == "success":
            order.payment_status = "paid"
            order.status = "placed"
            order.save(update_fields=["payment_status", "status"])

            # Auto-generate invoice
            invoice = generate_invoice(order)

            return Response({
                "detail": "Payment successful.",
                "order_id": order.id,
                "txn_id": payment.gateway_txn_id,
                "invoice_number": invoice.invoice_number,
                "invoice_url": request.build_absolute_uri(f"/api/invoices/{order.id}/"),
            })

        return Response({"detail": "Payment failed."}, status=status.HTTP_400_BAD_REQUEST)