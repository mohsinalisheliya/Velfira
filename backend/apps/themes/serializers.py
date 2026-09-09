from rest_framework import serializers
from .models import Theme


class ThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theme
        fields = ["id", "name", "primary_color", "accent_color", "background_color", "font_pair", "start_date", "end_date", "is_active"]