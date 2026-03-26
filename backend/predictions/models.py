from django.contrib.auth.models import User
from django.db import models


class Prediction(models.Model):
    class SoilType(models.TextChoices):
        SANDY = "Sandy", "Sandy"
        LOAMY = "Loamy", "Loamy"
        CLAY = "Clay", "Clay"
        SILT = "Silt", "Silt"
        PEATY = "Peaty", "Peaty"

    class ResultType(models.TextChoices):
        HIGH = "High", "High"
        MEDIUM = "Medium", "Medium"
        LOW = "Low", "Low"

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="predictions")
    soil_type = models.CharField(max_length=20, choices=SoilType.choices)
    irrigation = models.BooleanField()
    fertilizer_used = models.BooleanField()
    days_of_harvest = models.PositiveIntegerField(default=110)
    location = models.CharField(max_length=255)
    temperature = models.DecimalField(max_digits=5, decimal_places=2)
    rainfall = models.DecimalField(max_digits=7, decimal_places=2)
    result = models.CharField(max_length=10, choices=ResultType.choices)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.username} - {self.result} ({self.created_at:%Y-%m-%d})"
