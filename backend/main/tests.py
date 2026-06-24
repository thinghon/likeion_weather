from django.test import TestCase

from .geocoding_service import resolve_location


class LocationResolveTests(TestCase):
    def test_resolve_location_returns_nearest_city(self):
        result = resolve_location(36.77, 126.93)

        self.assertEqual(result["province"], "충남")
        self.assertEqual(result["city"], "아산시")
        self.assertEqual(result["region"], "충남 아산시")

    def test_location_resolve_api_requires_coordinates(self):
        response = self.client.get("/api/location/resolve/")

        self.assertEqual(response.status_code, 400)

    def test_location_resolve_api_returns_region_name(self):
        response = self.client.get("/api/location/resolve/?lat=36.77&lng=126.93")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["display_name"], "충남 아산시")
