from django.contrib import admin
from .models import *


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'parent')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'gst_rate', 'stock_qty', 'is_active')
    list_filter = ('category', 'is_active', 'gst_rate')
    search_fields = ('name', 'hsn_code')
    prepopulated_fields = {'slug': ('name',)}

# Baaki simple models ke liye tera loop structure
all_models = [ProductImage, ProductVariant, RelatedProduct]
for model in all_models:
    admin.site.register(model)
