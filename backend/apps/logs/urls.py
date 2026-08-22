from django.urls import path
from .views import SystemLogListView

app_name = "logs"

urlpatterns = [
    path("admin/logs/", SystemLogListView.as_view(), name="system-logs"),
]