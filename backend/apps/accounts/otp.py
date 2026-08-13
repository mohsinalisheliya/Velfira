import random
import hashlib
from datetime import timedelta
from django.utils import timezone
from django.conf import settings
from .models import OTPVerification


def generate_otp():
    return str(random.randint(100000, 999999))


def hash_otp(otp):
    return hashlib.sha256(otp.encode()).hexdigest()


def send_otp(mobile_number):
    """
    Creates an OTP record and 'sends' it.
    Dev mode: prints to console instead of a real SMS gateway.
    Swap the print() line for MSG91/Twilio later — nothing else changes.
    """
    otp = generate_otp()
    expires_at = timezone.now() + timedelta(minutes=settings.OTP_EXPIRY_MINUTES)

    OTPVerification.objects.create(
        mobile_number=mobile_number,
        otp_hash=hash_otp(otp),
        expires_at=expires_at,
    )

    print(f"[DEV OTP] {mobile_number} -> {otp}")  # replace with real SMS gateway call later
    return True


def verify_otp(mobile_number, otp):
    record = (
        OTPVerification.objects.filter(mobile_number=mobile_number, verified=False)
        .order_by("-created_at")
        .first()
    )

    if not record:
        return False, "No OTP requested for this number."

    if record.attempt_count >= settings.OTP_MAX_ATTEMPTS:
        return False, "Too many attempts. Request a new OTP."

    if timezone.now() > record.expires_at:
        return False, "OTP expired. Request a new one."

    record.attempt_count += 1
    record.save(update_fields=["attempt_count"])

    if record.otp_hash != hash_otp(otp):
        return False, "Incorrect OTP."

    record.verified = True
    record.save(update_fields=["verified"])
    return True, "Verified."