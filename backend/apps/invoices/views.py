from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.http import FileResponse
import os

from apps.orders.models import Order
from .models import Invoice


class InvoiceDownloadView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, order_id):
        order = get_object_or_404(Order, id=order_id, user=request.user)

        try:
            invoice = order.invoice
        except Invoice.DoesNotExist:
            return Response(
                {"detail": "Invoice not generated yet. Complete payment first."},
                status=status.HTTP_404_NOT_FOUND
            )

        file_path = invoice.pdf_file.path
        if not os.path.exists(file_path):
            return Response({"detail": "Invoice file not found."}, status=status.HTTP_404_NOT_FOUND)

        return FileResponse(
            open(file_path, "rb"),
            as_attachment=True,
            filename=f"{invoice.invoice_number}.txt"
        )