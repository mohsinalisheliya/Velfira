from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.db.models import Sum, Count, F
from django.utils import timezone
from datetime import timedelta

from apps.orders.models import Order, OrderItem
from apps.catalog.models import Product


class SalesSummaryView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        now = timezone.now()
        today = now.date()
        this_month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        last_30_days = now - timedelta(days=30)

        paid_orders = Order.objects.filter(payment_status="paid")

        total_revenue = paid_orders.aggregate(total=Sum("total"))["total"] or 0
        total_orders = paid_orders.count()
        this_month_revenue = paid_orders.filter(
            created_at__gte=this_month_start
        ).aggregate(total=Sum("total"))["total"] or 0
        today_orders = paid_orders.filter(created_at__date=today).count()

        return Response({
            "total_revenue": float(total_revenue),
            "total_orders": total_orders,
            "this_month_revenue": float(this_month_revenue),
            "today_orders": today_orders,
        })


class TopProductsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        top = (
            OrderItem.objects
            .filter(order__payment_status="paid")
            .values("product__id", "product__name", "product__price")
            .annotate(
                total_qty=Sum("quantity"),
                total_revenue=Sum(F("unit_price") * F("quantity"))
            )
            .order_by("-total_qty")[:10]
        )
        return Response(list(top))


class RevenueTrendView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        days = int(request.query_params.get("days", 30))
        since = timezone.now() - timedelta(days=days)

        orders = (
            Order.objects
            .filter(payment_status="paid", created_at__gte=since)
            .extra(select={"day": "DATE(created_at)"})
            .values("day")
            .annotate(revenue=Sum("total"), count=Count("id"))
            .order_by("day")
        )
        return Response(list(orders))


class LowStockView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        threshold = int(request.query_params.get("threshold", 5))
        products = Product.objects.filter(
            is_active=True, stock_qty__lte=threshold
        ).values("id", "name", "stock_qty", "category__name")
        return Response(list(products))


class RecentOrdersView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        orders = Order.objects.select_related("user").order_by("-created_at")[:20]
        data = [{
            "id": o.id,
            "mobile": o.user.mobile_number,
            "status": o.status,
            "payment_status": o.payment_status,
            "total": float(o.total),
            "created_at": o.created_at.strftime("%d %b %Y, %I:%M %p"),
        } for o in orders]
        return Response(data)