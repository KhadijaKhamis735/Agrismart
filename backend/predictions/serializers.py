from rest_framework import serializers
from django.utils.html import strip_tags

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
            "days_of_harvest",
            "location",
            "temperature",
            "rainfall",
            "result",
            "created_at",
        ]
        read_only_fields = ["id", "user", "result", "created_at"]

    def validate_location(self, value):
        clean = strip_tags(value).strip()
        if len(clean) < 2 or len(clean) > 120:
            raise serializers.ValidationError("Location must be between 2 and 120 characters.")
        return clean

    def validate_days_of_harvest(self, value):
        if value < 1 or value > 365:
            raise serializers.ValidationError("Days of harvest must be between 1 and 365.")
        return value

    def validate_temperature(self, value):
        if value < -20 or value > 60:
            raise serializers.ValidationError("Temperature is out of allowed range.")
        return value

    def validate_rainfall(self, value):
        if value < 0 or value > 20000:
            raise serializers.ValidationError("Rainfall is out of allowed range.")
        return value
