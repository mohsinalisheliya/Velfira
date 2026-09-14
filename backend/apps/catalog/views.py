from rest_framework import generics, filters
from rest_framework.permissions import AllowAny, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product, ProductImage, ProductVariant, ProductVideo, RelatedProduct
from .serializers import (
    CategorySerializer,
    ProductDetailSerializer,
    ProductListSerializer,
    ProductVariantSerializer,
    RelatedProductSerializer,
)



class CategoryListView(generics.ListAPIView):
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = Category.objects.all()
        homepage_only = self.request.query_params.get("homepage")
        if homepage_only:
            qs = qs.filter(show_on_homepage=True)
        return qs


class ProductListView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "description"]
    ordering_fields = ["price", "created_at"]
    ordering = ["-created_at"]

    def get_queryset(self):
        qs = Product.objects.filter(is_active=True).select_related("category").prefetch_related("images")
        category_slug = self.request.query_params.get("category")
        min_price = self.request.query_params.get("min_price")
        max_price = self.request.query_params.get("max_price")
        is_bestseller = self.request.query_params.get("is_bestseller")

        if category_slug:
            qs = qs.filter(category__slug=category_slug)
        if min_price:
            qs = qs.filter(price__gte=min_price)
        if max_price:
            qs = qs.filter(price__lte=max_price)
        if is_bestseller:
            qs = qs.filter(is_bestseller=True)
        return qs


class ProductDetailView(generics.RetrieveAPIView):
    serializer_class = ProductDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"
    queryset = Product.objects.filter(is_active=True).select_related("category").prefetch_related(
        "images", "variants", "related_from__related_product"
    )


class AdminProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all().select_related("category")
    serializer_class = ProductDetailSerializer
    permission_classes = [IsAdminUser]


class AdminProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductDetailSerializer
    permission_classes = [IsAdminUser]

from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import ProductImage, ProductVideo


class AdminProductMediaUploadView(APIView):
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, product_id):
        product = get_object_or_404(Product, id=product_id)
        images = request.FILES.getlist("images")
        videos = request.FILES.getlist("videos")
        for i, img in enumerate(images):
            ProductImage.objects.create(product=product, image=img, sort_order=i)
        for i, vid in enumerate(videos):
            ProductVideo.objects.create(product=product, video=vid, sort_order=i)
        return Response({"detail": f"{len(images)} images, {len(videos)} videos uploaded."})

    def delete(self, request, product_id):
        ProductImage.objects.filter(id=request.data.get("image_id")).delete()
        ProductVideo.objects.filter(id=request.data.get("video_id")).delete()
        return Response({"detail": "Deleted."})

class AdminVariantListCreateView(generics.ListCreateAPIView):
    serializer_class = ProductVariantSerializer
    permission_classes = [IsAdminUser]
    def get_queryset(self):
        return ProductVariant.objects.filter(product_id=self.kwargs["product_id"])
    def perform_create(self, serializer):
        serializer.save(product_id=self.kwargs["product_id"])

class AdminVariantDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ProductVariant.objects.all()
    serializer_class = ProductVariantSerializer
    permission_classes = [IsAdminUser]

class AdminRelatedListCreateView(generics.ListCreateAPIView):
    serializer_class = RelatedProductSerializer
    permission_classes = [IsAdminUser]
    def get_queryset(self):
        return RelatedProduct.objects.filter(product_id=self.kwargs["product_id"])
    def perform_create(self, serializer):
        serializer.save(product_id=self.kwargs["product_id"])

class AdminRelatedDetailView(generics.RetrieveDestroyAPIView):
    queryset = RelatedProduct.objects.all()
    serializer_class = RelatedProductSerializer
    permission_classes = [IsAdminUser]