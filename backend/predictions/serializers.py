from rest_framework import serializers

from .models import Prediction


class PredictionSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source="user.username")

    class Meta:
        model = Prediction
        fields = [
            "id",
            "user",
            "soil_type",
            "irrigation",
            "fertilizer_used",
            "location",
            "temperature",
            "rainfall",
            "result",
            "created_at",
        ]
        read_only_fields = ["id", "user", "result", "created_at"]
