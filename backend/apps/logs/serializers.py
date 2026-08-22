from rest_framework import serializers
from .models import SystemLog


class SystemLogSerializer(serializers.ModelSerializer):
    order_id = serializers.IntegerField(source="order.id", read_only=True, allow_null=True)
    user_mobile = serializers.CharField(source="user.mobile_number", read_only=True, allow_null=True)

    class Meta:
        model = SystemLog
        fields = [
            "id", "level", "source_module", "message",
            "stack_trace", "order_id", "user_mobile", "created_at"
        ]