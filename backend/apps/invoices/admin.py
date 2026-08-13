from django.contrib import admin
from .models import *


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('invoice_number', 'order', 'generated_at')
    search_fields = ('invoice_number', 'order__id')
