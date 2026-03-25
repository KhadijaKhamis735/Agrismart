from django.contrib import admin

from .models import Prediction


@admin.register(Prediction)
class PredictionAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "soil_type", "result", "created_at")
    list_filter = ("soil_type", "result", "irrigation", "fertilizer_used")
    search_fields = ("user__username", "location")
