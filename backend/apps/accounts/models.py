from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    mobile_number = models.CharField(max_length=15, unique=True, null=True, blank=True)
    mobile_verified = models.BooleanField(default=False)
    def __str__(self):
        return self.username

class Address(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="addresses")
    full_name = models.CharField(max_length=150, default="")
    mobile_number = models.CharField(max_length=15, default="")
    pincode = models.CharField(max_length=10)
    flat = models.CharField(max_length=255, default="")
    area = models.CharField(max_length=255, default="")
    landmark = models.CharField(max_length=255, blank=True, default="")
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    is_default = models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = "Addresses"

    def __str__(self):
        return f"{self.full_name} - {self.city} - {self.pincode}"

class OTPVerification(models.Model):
    mobile_number = models.CharField(max_length=15, db_index=True)
    otp_hash = models.CharField(max_length=128)
    expires_at = models.DateTimeField()
    verified = models.BooleanField(default=False)
    attempt_count = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        indexes = [models.Index(fields=["mobile_number"])]
    def __str__(self):
        return f"OTP for {self.mobile_number}"
