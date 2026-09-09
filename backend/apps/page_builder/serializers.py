from rest_framework import serializers
from .models import PageLayout, PageBlock


class PageBlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageBlock
        fields = ["id", "block_type", "config", "sort_order", "is_active"]


class PageLayoutSerializer(serializers.ModelSerializer):
    blocks = PageBlockSerializer(many=True, read_only=True)

    class Meta:
        model = PageLayout
        fields = ["id", "page_key", "status", "updated_at", "blocks"]