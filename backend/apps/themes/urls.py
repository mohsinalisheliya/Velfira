from django.urls import path
from .views import ActiveThemeView, AdminThemeListCreateView, AdminThemeDetailView, AdminActivateThemeView

app_name = "themes"
urlpatterns = [
    path("theme/active/", ActiveThemeView.as_view(), name="theme-active"),
    path("admin/themes/", AdminThemeListCreateView.as_view(), name="admin-theme-list"),
    path("admin/themes/<int:pk>/", AdminThemeDetailView.as_view(), name="admin-theme-detail"),
    path("admin/themes/<int:pk>/activate/", AdminActivateThemeView.as_view(), name="admin-theme-activate"),
]