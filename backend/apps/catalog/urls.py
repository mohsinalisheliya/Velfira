from django.urls import path
from .views import  *

urlpatterns = [
    path("categories/", CategoryListView.as_view(), name="category-list"),
    path("products/", ProductListView.as_view(), name="product-list"),
    path("products/<slug:slug>/", ProductDetailView.as_view(), name="product-detail"),
    path("admin/products/", AdminProductListCreateView.as_view(), name="admin-product-list"),
    path("admin/products/<int:pk>/", AdminProductDetailView.as_view(), name="admin-product-detail"),
    path("admin/products/<int:product_id>/media/", AdminProductMediaUploadView.as_view(), name="admin-product-media"),
    path("admin/products/<int:product_id>/variants/", AdminVariantListCreateView.as_view()),
path("admin/variants/<int:pk>/", AdminVariantDetailView.as_view()),
path("admin/products/<int:product_id>/related/", AdminRelatedListCreateView.as_view()),
path("admin/related/<int:pk>/", AdminRelatedDetailView.as_view()),
]