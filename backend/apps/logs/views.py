from rest_framework import generics, filters
from rest_framework.permissions import IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from .models import SystemLog
from .serializers import SystemLogSerializer


class SystemLogListView(generics.ListAPIView):
    serializer_class = SystemLogSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["level", "source_module"]
    search_fields = ["message", "source_module", "stack_trace"]
    ordering = ["-created_at"]

    def get_queryset(self):
        qs = SystemLog.objects.select_related("order", "user").all()
        level = self.request.query_params.get("level")
        if level:
            qs = qs.filter(level=level)
        return qs