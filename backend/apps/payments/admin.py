from django.contrib import admin
from .models import *


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('order', 'gateway', 'gateway_txn_id', 'amount', 'status', 'created_at')
    list_filter = ('gateway', 'status')
