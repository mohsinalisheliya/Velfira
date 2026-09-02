from django.db import models

GST_RATE_CHOICES = [
    (3, "3%"),
    (5, "5%"),
    (12, "12%"),
    (18, "18%"),
]


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True)
    parent = models.ForeignKey(
        "self", null=True, blank=True, on_delete=models.SET_NULL, related_name="children"
    )

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="products")
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    hsn_code = models.CharField(max_length=15, help_text="HSN code for GST invoicing")
    gst_rate = models.DecimalField(max_digits=4, decimal_places=2, choices=GST_RATE_CHOICES, default=3)
    stock_qty = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_bestseller = models.BooleanField(default=False)

    class Meta:
        indexes = [
            models.Index(fields=["category"]),
            models.Index(fields=["slug"]),
        ]

    def __str__(self):
        return self.name


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="products/")
    sort_order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["sort_order"]

    def __str__(self):
        return f"Image for {self.product.name}"


class ProductVariant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="variants")
    sku = models.CharField(max_length=50, unique=True)
    attributes = models.JSONField(default=dict, blank=True)
    price_override = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    stock_qty = models.PositiveIntegerField(default=0)
    image = models.ImageField(upload_to="variants/", null=True, blank=True)

    def effective_price(self):
        return self.price_override if self.price_override is not None else self.product.price

    def __str__(self):
        return f"{self.product.name} ({self.sku})"


class RelatedProduct(models.Model):
    RELATION_CHOICES = [
        ("similar", "Similar"),
        ("cross_sell", "Cross-sell"),
    ]
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="related_from")
    related_product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="related_to")
    relation_type = models.CharField(max_length=20, choices=RELATION_CHOICES, default="similar")
    sort_order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        unique_together = ("product", "related_product")
        ordering = ["sort_order"]

    def __str__(self):
        return f"{self.product.name} -> {self.related_product.name}"