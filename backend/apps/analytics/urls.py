from django.urls import path
from .views import (
    SalesSummaryView, TopProductsView,
    RevenueTrendView, LowStockView, RecentOrdersView
)

urlpatterns = [
    path("admin/analytics/summary/", SalesSummaryView.as_view(), name="analytics-summary"),
    path("admin/analytics/top-products/", TopProductsView.as_view(), name="analytics-top-products"),
    path("admin/analytics/revenue-trend/", RevenueTrendView.as_view(), name="analytics-revenue-trend"),
    path("admin/analytics/low-stock/", LowStockView.as_view(), name="analytics-low-stock"),
    path("admin/analytics/recent-orders/", RecentOrdersView.as_view(), name="analytics-recent-orders"),
]