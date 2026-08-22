from rest_framework import serializers
from .models import Banner


class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = ["id", "title", "image", "link_url", "position", "start_date", "end_date", "is_active"]