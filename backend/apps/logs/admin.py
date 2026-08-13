from django.contrib import admin
from .models import *


@admin.register(SystemLog)
class SystemLogAdmin(admin.ModelAdmin):
    list_display = ('level', 'source_module', 'order', 'user', 'created_at')
    list_filter = ('level', 'source_module', 'created_at')
    search_fields = ('message', 'source_module')
