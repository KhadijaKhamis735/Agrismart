from django.contrib.auth.models import User
from django.utils.html import strip_tags
import logging
import re
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

logger = logging.getLogger("security")


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        username = strip_tags(attrs.get("username", "")).strip()
        request = self.context.get("request")
        ip = request.META.get("REMOTE_ADDR") if request else "unknown"

        try:
            data = super().validate(attrs)
            logger.info("login_success username=%s ip=%s", username, ip)
            return data
        except Exception:
            logger.warning("login_failed username=%s ip=%s", username, ip)
            raise

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["username"] = user.username
        return token


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]

    def validate_username(self, value):
        clean = strip_tags(value).strip()
        if not re.fullmatch(r"[A-Za-z0-9_.-]{3,30}", clean):
            raise serializers.ValidationError("Username must be 3-30 chars and only letters, numbers, _, ., -")
        return clean

    def validate_email(self, value):
        return strip_tags(value).strip().lower()

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
        )


class UserProfileSerializer(serializers.ModelSerializer):
    current_password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    new_password = serializers.CharField(write_only=True, required=False, allow_blank=True, min_length=8)
    confirm_new_password = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "date_joined",
            "last_login",
            "current_password",
            "new_password",
            "confirm_new_password",
        ]
        read_only_fields = ["id", "date_joined", "last_login"]

    def validate(self, attrs):
        if "username" in attrs:
            attrs["username"] = strip_tags(attrs["username"]).strip()
            if not re.fullmatch(r"[A-Za-z0-9_.-]{3,30}", attrs["username"]):
                raise serializers.ValidationError({"username": "Invalid username format."})

        if "email" in attrs:
            attrs["email"] = strip_tags(attrs["email"]).strip().lower()

        for name_field in ("first_name", "last_name"):
            if name_field in attrs:
                attrs[name_field] = strip_tags(attrs[name_field]).strip()

        current_password = attrs.get("current_password", "")
        new_password = attrs.get("new_password", "")
        confirm_new_password = attrs.get("confirm_new_password", "")

        # Password change is optional, but if initiated, require all checks.
        if new_password:
            if not current_password:
                raise serializers.ValidationError({"current_password": "Current password is required."})
            if new_password != confirm_new_password:
                raise serializers.ValidationError({"confirm_new_password": "Passwords do not match."})

        return attrs

    def update(self, instance, validated_data):
        current_password = validated_data.pop("current_password", "")
        new_password = validated_data.pop("new_password", "")
        validated_data.pop("confirm_new_password", "")

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if new_password:
            if not instance.check_password(current_password):
                raise serializers.ValidationError({"current_password": "Current password is incorrect."})
            instance.set_password(new_password)

        instance.save()
        return instance
