from django.urls import path
from .views import InitiatePaymentView

app_name = "payments"
urlpatterns = [
    path("payments/<int:order_id>/initiate/", InitiatePaymentView.as_view(), name="payment-initiate"),
]