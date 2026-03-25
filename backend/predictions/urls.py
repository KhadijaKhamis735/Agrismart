from django.urls import path

from .views import PredictionListCreateView, PredictionStatsView

urlpatterns = [
    path("", PredictionListCreateView.as_view(), name="predictions"),
    path("stats/", PredictionStatsView.as_view(), name="prediction-stats"),
]
