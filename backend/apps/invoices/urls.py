from django.urls import path
from .views import InvoiceDownloadView

app_name = "invoices"
urlpatterns = [
    path("invoices/<int:order_id>/", InvoiceDownloadView.as_view(), name="invoice-download"),
]