from django.urls import path
from .views import (
    PublicPageLayoutView, AdminPageLayoutListCreateView, AdminPageLayoutDetailView,
    AdminPublishLayoutView, AdminPageBlockListCreateView, AdminPageBlockDetailView
)



urlpatterns = [
    path("pages/<str:page_key>/", PublicPageLayoutView.as_view(), name="page-layout-public"),
    path("admin/page-layouts/", AdminPageLayoutListCreateView.as_view(), name="admin-page-layout-list"),
    path("admin/page-layouts/<int:pk>/", AdminPageLayoutDetailView.as_view(), name="admin-page-layout-detail"),
    path("admin/page-layouts/<int:pk>/publish/", AdminPublishLayoutView.as_view(), name="admin-page-layout-publish"),
    path("admin/page-layouts/<int:layout_id>/blocks/", AdminPageBlockListCreateView.as_view(), name="admin-page-block-list"),
    path("admin/page-blocks/<int:pk>/", AdminPageBlockDetailView.as_view(), name="admin-page-block-detail"),
]