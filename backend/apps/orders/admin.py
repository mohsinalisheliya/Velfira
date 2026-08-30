from django.contrib import admin
from .models import *

#-----------------------------[Order Admin]----------------
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'status', 'payment_status', 'total', 'created_at')
    list_filter = ('status', 'payment_status', 'created_at')
    search_fields = ('id', 'user__mobile_number')

all_models = [OrderItem]
for model in all_models:
    admin.site.register(model)
