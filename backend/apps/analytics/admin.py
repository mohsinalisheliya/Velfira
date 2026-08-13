from django.contrib import admin
from .models import *


@admin.register(DailyAnalytics)
class DailyAnalyticsAdmin(admin.ModelAdmin):
    list_display = ('date', 'total_sales', 'total_orders', 'new_users')
    ordering = ('-date',)
