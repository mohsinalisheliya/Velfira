from django.urls import path
from .views import CategoryListView, ProductListView, ProductDetailView

urlpatterns = [
    path("categories/", CategoryListView.as_view(), name="category-list"),
    path("products/", ProductListView.as_view(), name="product-list"),
    path("products/<slug:slug>/", ProductDetailView.as_view(), name="product-detail"),
    
path("admin/products/", AdminProductListCreateView.as_view(), name="admin-product-list"),
path("admin/products/<int:pk>/", AdminProductDetailView.as_view(), name="admin-product-detail"),

]