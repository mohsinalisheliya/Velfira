from django.contrib import admin
from .models import Category, Product, ProductImage, ProductVariant, RelatedProduct, ProductVideo


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


class ProductVideoInline(admin.TabularInline):
    model = ProductVideo
    extra = 1


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1


class RelatedProductInline(admin.TabularInline):
    model = RelatedProduct
    fk_name = "product"
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "price", "gst_rate", "stock_qty", "is_active")
    list_filter = ("category", "is_active", "gst_rate")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [ProductImageInline, ProductVideoInline, ProductVariantInline, RelatedProductInline]


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}
    list_display = ("name", "parent")