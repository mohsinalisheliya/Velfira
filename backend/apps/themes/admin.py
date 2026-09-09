from django.contrib import admin
from .models import *


@admin.register(Theme)
class ThemeAdmin(admin.ModelAdmin):
    list_display = ("name", "primary_color", "accent_color", "is_active", "start_date", "end_date")
    list_editable = ("is_active",)