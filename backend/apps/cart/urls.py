from django.urls import path
from .views import CartView, CartItemDetailView

app_name = "cart"
urlpatterns = [
    path("cart/", CartView.as_view(), name="cart"),
    path("cart/items/<int:item_id>/", CartItemDetailView.as_view(), name="cart-item-detail"),
]