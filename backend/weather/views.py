from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .services import WeatherServiceError, fetch_weather


class WeatherView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        location = request.query_params.get("location")
        lat = request.query_params.get("lat")
        lon = request.query_params.get("lon")

        try:
            weather = fetch_weather(location=location, lat=lat, lon=lon)
            return Response(weather)
        except WeatherServiceError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
