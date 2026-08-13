from django.db import models

class Theme(models.Model):
    name = models.CharField(max_length=100)
    primary_color = models.CharField(max_length=20, default='#1F1D1B')
    accent_color = models.CharField(max_length=20, default='#B08D3E')
    background_color = models.CharField(max_length=20, default='#FDFBF7')
    font_pair = models.CharField(max_length=100, default='Playfair Display, Inter')
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=False)
