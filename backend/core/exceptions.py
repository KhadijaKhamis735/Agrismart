import logging

from rest_framework.views import exception_handler

logger = logging.getLogger("security")


def custom_exception_handler(exc, context):
    """Avoid leaking internals while keeping useful API errors."""
    response = exception_handler(exc, context)

    if response is None:
        view_name = context.get("view").__class__.__name__ if context.get("view") else "unknown"
        logger.exception("Unhandled API error in view=%s", view_name)
        return None

    if response.status_code >= 500:
        response.data = {"detail": "Internal server error."}

    return response
