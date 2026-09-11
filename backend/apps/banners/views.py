from .serializers import BannerSerializer
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAdminUser
from django.utils import timezone
from django.db import models
from .models import Banner
from .serializers import BannerSerializer

class ActiveBannerListView(generics.ListAPIView):
    """Customer-facing: only active banners within schedule"""
    serializer_class = BannerSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        now = timezone.now()
        position = self.request.query_params.get("position", "home_hero")
        return Banner.objects.filter(
            is_active=True,
            position=position,
        ).filter(
            models.Q(start_date__isnull=True) | models.Q(start_date__lte=now)
        ).filter(
            models.Q(end_date__isnull=True) | models.Q(end_date__gte=now)
        )


class AdminBannerListCreateView(generics.ListCreateAPIView):
    queryset = Banner.objects.all().order_by("-id")
    serializer_class = BannerSerializer
    permission_classes = [IsAdminUser]


class AdminBannerDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Banner.objects.all()
    serializer_class = BannerSerializer
    permission_classes = [IsAdminUser]

from rest_framework import generics
from rest_framework.permissions import IsAdminUser
from .models import Banner
from .serializers import BannerSerializer

class AdminBannerListCreateView(generics.ListCreateAPIView):
    queryset = Banner.objects.all().order_by("-id")
    serializer_class = BannerSerializer
    permission_classes = [IsAdminUser]

class AdminBannerDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Banner.objects.all()
    serializer_class = BannerSerializer
    permission_classes = [IsAdminUser]