from django.test import SimpleTestCase
from django.urls import resolve

from apps.logs.views import SystemLogListView
from .views import health_check


class RootRouteTests(SimpleTestCase):
    def test_root_returns_health_response(self):
        response = self.client.get("/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok"})

    def test_system_logs_route_resolves(self):
        self.assertEqual(resolve("/system-logs/").func.view_class, SystemLogListView)

    def test_root_route_resolves(self):
        self.assertEqual(resolve("/").func, health_check)
