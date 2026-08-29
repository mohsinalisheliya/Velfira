from django.urls import path
from .views import CheckoutView, OrderListView, OrderDetailView

app_name = "orders"

#-----------------------------[URL Patterns]----------------
urlpatterns = [
    path("checkout/", CheckoutView.as_view(), name="checkout"),
    path("orders/", OrderListView.as_view(), name="order-list"),
    path("orders/<int:pk>/", OrderDetailView.as_view(), name="order-detail"),
]