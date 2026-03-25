from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Prediction",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                (
                    "soil_type",
                    models.CharField(
                        choices=[
                            ("Sandy", "Sandy"),
                            ("Loamy", "Loamy"),
                            ("Clay", "Clay"),
                            ("Silt", "Silt"),
                            ("Peaty", "Peaty"),
                        ],
                        max_length=20,
                    ),
                ),
                ("irrigation", models.BooleanField()),
                ("fertilizer_used", models.BooleanField()),
                ("location", models.CharField(max_length=255)),
                ("temperature", models.DecimalField(decimal_places=2, max_digits=5)),
                ("rainfall", models.DecimalField(decimal_places=2, max_digits=7)),
                (
                    "result",
                    models.CharField(
                        choices=[("High", "High"), ("Medium", "Medium"), ("Low", "Low")], max_length=10
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="predictions",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={"ordering": ["-created_at"]},
        ),
    ]
