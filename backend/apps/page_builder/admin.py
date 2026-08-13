from django.contrib import admin
from .models import *


all_models = [PageLayout, PageBlock]
for model in all_models:
    admin.site.register(model)
