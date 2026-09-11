from django.urls import path
from .views import *

app_name = "banners"
urlpatterns = [
    path("banners/", ActiveBannerListView.as_view(), name="banner-list"),
    path("admin/banners/", AdminBannerListCreateView.as_view(), name="admin-banner-list"),
    path("admin/banners/<int:pk>/", AdminBannerDetailView.as_view(), name="admin-banner-detail"),
    path("admin/banners/", AdminBannerListCreateView.as_view(), name="admin-banner-list"),
path("admin/banners/<int:pk>/", AdminBannerDetailView.as_view(), name="admin-banner-detail"),
]