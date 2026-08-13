from django.contrib import admin
from .models import *


all_models = [Cart, CartItem]
for model in all_models:
    admin.site.register(model)
