from django.db import models

class PageLayout(models.Model):
    STATUS_CHOICES = [('draft', 'Draft'), ('published', 'Published')]
    page_key = models.CharField(max_length=50, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    updated_at = models.DateTimeField(auto_now=True)

class PageBlock(models.Model):
    layout = models.ForeignKey(PageLayout, on_delete=models.CASCADE, related_name='blocks')
    block_type = models.CharField(max_length=50)
    config = models.JSONField(default=dict)
    sort_order = models.PositiveSmallIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['sort_order']
        indexes = [models.Index(fields=['layout', 'sort_order'])]
