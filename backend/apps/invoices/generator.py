import os
from datetime import datetime
from django.conf import settings
from django.utils import timezone
from .models import Invoice


def generate_invoice_number():
    now = timezone.now()
    return f"VEL-{now.strftime('%Y%m')}-{now.strftime('%H%M%S%f')[:10]}"


def generate_invoice(order):
    """
    Generates a GST-compliant invoice for the order.
    Phase 1: saves a text-based invoice file.
    Phase 2: swap with WeasyPrint PDF.
    """
    if hasattr(order, "invoice"):
        return order.invoice

    invoice_number = generate_invoice_number()

    # Build invoice content
    lines = []
    lines.append("=" * 60)
    lines.append("                    VELFIRA")
    lines.append("              Luxury Without Limits")
    lines.append("=" * 60)
    lines.append(f"Invoice No  : {invoice_number}")
    lines.append(f"Date        : {timezone.now().strftime('%d %b %Y, %I:%M %p')}")
    lines.append(f"Order ID    : #{order.id}")
    lines.append("-" * 60)
    lines.append(f"Customer    : {order.user.mobile_number}")
    lines.append(f"Address     : {order.address.line1}, {order.address.city}")
    lines.append(f"             {order.address.state} - {order.address.pincode}")
    lines.append("-" * 60)
    lines.append(f"{'Item':<30} {'Qty':>4} {'Price':>10} {'GST%':>6} {'Total':>10}")
    lines.append("-" * 60)

    for item in order.items.select_related("product").all():
        item_total = float(item.unit_price) * item.quantity
        lines.append(
            f"{item.product.name[:30]:<30} {item.quantity:>4} "
            f"₹{float(item.unit_price):>9.2f} {float(item.gst_rate_snapshot):>5.0f}% "
            f"₹{item_total:>9.2f}"
        )

    lines.append("-" * 60)
    lines.append(f"{'Subtotal':<50} ₹{float(order.subtotal):>9.2f}")
    lines.append(f"{'GST':<50} ₹{float(order.gst_amount):>9.2f}")

    if order.discount_amount > 0:
        lines.append(f"{'Discount':<50} -₹{float(order.discount_amount):>8.2f}")

    lines.append("=" * 60)
    lines.append(f"{'TOTAL':<50} ₹{float(order.total):>9.2f}")
    lines.append("=" * 60)
    lines.append("Thank you for shopping with Velfira!")
    lines.append("For support: support@velfira.com")
    lines.append("=" * 60)

    content = "\n".join(lines)

    # Save to file
    invoice_dir = os.path.join(settings.MEDIA_ROOT, "invoices")
    os.makedirs(invoice_dir, exist_ok=True)
    filename = f"{invoice_number}.txt"
    filepath = os.path.join(invoice_dir, filename)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

    invoice = Invoice.objects.create(
        order=order,
        invoice_number=invoice_number,
        pdf_file=f"invoices/{filename}",
    )

    return invoice