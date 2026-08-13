from django.db import models

class DailyAnalytics(models.Model):
    date = models.DateField(unique=True)
    total_sales = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_orders = models.PositiveIntegerField(default=0)
    new_users = models.PositiveIntegerField(default=0)
