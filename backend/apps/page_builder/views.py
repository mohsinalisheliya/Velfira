from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from django.shortcuts import get_object_or_404
from .models import PageLayout, PageBlock
from .serializers import PageLayoutSerializer, PageBlockSerializer


class PublicPageLayoutView(APIView):
    """GET /api/pages/<page_key>/ — only returns the PUBLISHED layout."""
    permission_classes = [AllowAny]

    def get(self, request, page_key):
        layout = get_object_or_404(PageLayout, page_key=page_key, status="published")
        return Response(PageLayoutSerializer(layout).data)


class AdminPageLayoutListCreateView(generics.ListCreateAPIView):
    queryset = PageLayout.objects.all()
    serializer_class = PageLayoutSerializer
    permission_classes = [IsAdminUser]


class AdminPageLayoutDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = PageLayout.objects.all()
    serializer_class = PageLayoutSerializer
    permission_classes = [IsAdminUser]


class AdminPublishLayoutView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        layout = get_object_or_404(PageLayout, pk=pk)
        layout.status = "published"
        layout.save(update_fields=["status"])
        return Response(PageLayoutSerializer(layout).data)


class AdminPageBlockListCreateView(generics.ListCreateAPIView):
    serializer_class = PageBlockSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return PageBlock.objects.filter(layout_id=self.kwargs["layout_id"]).order_by("sort_order")

    def perform_create(self, serializer):
        serializer.save(layout_id=self.kwargs["layout_id"])


class AdminPageBlockDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = PageBlock.objects.all()
    serializer_class = PageBlockSerializer
    permission_classes = [IsAdminUser]