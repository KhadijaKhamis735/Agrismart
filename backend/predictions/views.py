from collections import Counter, defaultdict

from django.db.models import Count
from django.db.models.functions import TruncDate
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Prediction
from .predictor import predict_yield_level
from .serializers import PredictionSerializer


class PredictionListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        predictions = Prediction.objects.filter(user=request.user).order_by("-created_at")
        serializer = PredictionSerializer(predictions, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PredictionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        payload = serializer.validated_data
        result = predict_yield_level(
            soil_type=payload["soil_type"],
            irrigation=payload["irrigation"],
            fertilizer_used=payload["fertilizer_used"],
            temperature=payload["temperature"],
            rainfall=payload["rainfall"],
        )

        prediction = Prediction.objects.create(
            user=request.user,
            soil_type=payload["soil_type"],
            irrigation=payload["irrigation"],
            fertilizer_used=payload["fertilizer_used"],
            location=payload["location"],
            temperature=payload["temperature"],
            rainfall=payload["rainfall"],
            result=result,
        )

        return Response(PredictionSerializer(prediction).data, status=status.HTTP_201_CREATED)


class PredictionStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        queryset = Prediction.objects.filter(user=request.user).order_by("created_at")
        all_predictions = list(queryset)

        result_counts = Counter(item.result for item in all_predictions)
        pie_data = [
            {"name": "High", "value": result_counts.get("High", 0)},
            {"name": "Medium", "value": result_counts.get("Medium", 0)},
            {"name": "Low", "value": result_counts.get("Low", 0)},
        ]

        trend_rows = (
            queryset.annotate(day=TruncDate("created_at"))
            .values("day", "result")
            .annotate(count=Count("id"))
            .order_by("day")
        )
        trend_map = defaultdict(lambda: {"High": 0, "Medium": 0, "Low": 0})
        for row in trend_rows:
            trend_map[str(row["day"])][row["result"]] = row["count"]
        line_data = [
            {
                "date": date,
                "High": values["High"],
                "Medium": values["Medium"],
                "Low": values["Low"],
            }
            for date, values in trend_map.items()
        ]

        soil_rows = (
            queryset.values("soil_type", "result")
            .annotate(count=Count("id"))
            .order_by("soil_type")
        )
        soil_map = defaultdict(lambda: {"High": 0, "Medium": 0, "Low": 0})
        for row in soil_rows:
            soil_map[row["soil_type"]][row["result"]] = row["count"]
        bar_data = [
            {
                "soil_type": soil,
                "High": values["High"],
                "Medium": values["Medium"],
                "Low": values["Low"],
            }
            for soil, values in soil_map.items()
        ]

        latest = all_predictions[-1] if all_predictions else None
        most_common_result = result_counts.most_common(1)[0][0] if result_counts else None

        summary = {
            "total_predictions": len(all_predictions),
            "most_common_result": most_common_result,
            "latest_result": latest.result if latest else None,
            "last_prediction_date": latest.created_at if latest else None,
        }

        last_10 = PredictionSerializer(list(reversed(all_predictions[-10:])), many=True).data

        return Response(
            {
                "summary": summary,
                "pie": pie_data,
                "line": line_data,
                "bar": bar_data,
                "recent": last_10,
            }
        )
