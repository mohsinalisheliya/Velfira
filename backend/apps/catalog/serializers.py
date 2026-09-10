from rest_framework import serializers
from .models import *


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug", "parent" , "image", "sort_order"]


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image", "sort_order"]


class ProductVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVideo
        fields = ["id", "video", "sort_order"]

class ProductVariantSerializer(serializers.ModelSerializer):
    effective_price = serializers.SerializerMethodField()

    class Meta:
        model = ProductVariant
        fields = ["id", "sku", "attributes", "price_override", "effective_price", "stock_qty", "image"]

    def get_effective_price(self, obj):
        return obj.effective_price()


class RelatedProductSerializer(serializers.ModelSerializer):
    related_product_name = serializers.CharField(source="related_product.name")
    related_product_slug = serializers.CharField(source="related_product.slug")
    related_product_price = serializers.DecimalField(
        source="related_product.price", max_digits=10, decimal_places=2
    )

    class Meta:
        model = RelatedProduct
        fields = ["related_product_name", "related_product_slug", "related_product_price", "relation_type"]


class ProductListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    primary_image = serializers.SerializerMethodField()


    class Meta:
        model = Product
        fields = ["id", "name", "slug", "category_name", "price", "gst_rate", "stock_qty", "is_bestseller", "primary_image"]

    def get_primary_image(self, obj):
        first = obj.images.first()
        if first:
            request = self.context.get("request")
            return request.build_absolute_uri(first.image.url) if request else first.image.url
        return None


class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    videos = ProductVideoSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    related_products = serializers.SerializerMethodField()
    price_with_gst = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id", "name", "slug", "category", "description",
            "price", "gst_rate", "price_with_gst", "hsn_code",
            "stock_qty", "is_active", "images", "variants", "related_products"
        ]

    def get_price_with_gst(self, obj):
        return round(float(obj.price) * (1 + float(obj.gst_rate) / 100), 2)

    def get_related_products(self, obj):
        # admin-curated first
        curated = obj.related_from.select_related("related_product").all()
        if curated.exists():
            return RelatedProductSerializer(curated, many=True).data
        # fallback: same category, in stock, exclude self
        fallback = Product.objects.filter(
            category=obj.category, is_active=True, stock_qty__gt=0
        ).exclude(id=obj.id)[:6]
        return ProductListSerializer(fallback, many=True, context=self.context).data