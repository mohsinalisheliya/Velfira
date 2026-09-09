from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from .models import Theme
from .serializers import ThemeSerializer


class ActiveThemeView(APIView):
    """GET /api/theme/active/ — public, used by frontend to apply CSS variables."""
    permission_classes = [AllowAny]

    def get(self, request):
        theme = Theme.objects.filter(is_active=True).first()
        if not theme:
            return Response(None)
        return Response(ThemeSerializer(theme).data)


class AdminThemeListCreateView(generics.ListCreateAPIView):
    queryset = Theme.objects.all()
    serializer_class = ThemeSerializer
    permission_classes = [IsAdminUser]


class AdminThemeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Theme.objects.all()
    serializer_class = ThemeSerializer
    permission_classes = [IsAdminUser]


class AdminActivateThemeView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        Theme.objects.update(is_active=False)  # deactivate all others
        theme = Theme.objects.filter(pk=pk).first()
        if not theme:
            return Response({"detail": "Theme not found."}, status=404)
        theme.is_active = True
        theme.save(update_fields=["is_active"])
        return Response(ThemeSerializer(theme).data)