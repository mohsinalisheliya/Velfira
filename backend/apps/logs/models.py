from django.db import models
from apps.accounts.models import User
from apps.orders.models import Order

class SystemLog(models.Model):
    LEVEL_CHOICES = [('info', 'Info'), ('warning', 'Warning'), ('error', 'Error'), ('critical', 'Critical')]
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    source_module = models.CharField(max_length=100)
    message = models.TextField()
    stack_trace = models.TextField(blank=True, null=True)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        indexes = [models.Index(fields=['level']), models.Index(fields=['created_at'])]
