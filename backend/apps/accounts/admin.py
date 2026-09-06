from django.contrib import admin
from .models import User, Address, OTPVerification

# --- Custom Velfira Global Admin Branding ---
admin.site.site_header = "Velfira Administration"
admin.site.site_title = "Velfira Admin Portal"
admin.site.index_title = "Welcome to Velfira Control Panel"

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    # Tumhare actual DB schema ke hisaab se fields update kar di hain
    list_display = ('mobile_number', 'first_name', 'last_name', 'is_active', 'is_staff', 'mobile_verified')
    search_fields = ('mobile_number', 'first_name', 'last_name', 'email')
    list_filter = ('is_active', 'is_staff', 'mobile_verified')

@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ("full_name", "flat", "city", "user")
    search_fields = ('user__mobile_number', 'city', 'pincode')
    list_filter = ('is_default', 'state')

@admin.register(OTPVerification)
class OTPVerificationAdmin(admin.ModelAdmin):
    list_display = ('mobile_number', 'verified', 'expires_at', 'attempt_count')
    search_fields = ('mobile_number',)
    list_filter = ('verified',)
