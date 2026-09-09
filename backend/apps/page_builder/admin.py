from django.contrib import admin
from .models import *


class PageBlockInline(admin.TabularInline):
    model = PageBlock
    extra = 1


@admin.register(PageLayout)
class PageLayoutAdmin(admin.ModelAdmin):
    list_display = ("page_key", "status", "updated_at")
    inlines = [PageBlockInline]