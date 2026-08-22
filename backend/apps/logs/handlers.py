import logging
import traceback


class DatabaseLogHandler(logging.Handler):
    """
    Custom Django logging handler — lazy import to avoid AppRegistryNotReady.
    """

    def emit(self, record):
        try:
            # Lazy import — sirf jab actually log likhna ho tab import karo
            from apps.logs.models import SystemLog

            level_map = {
                "DEBUG": "info",
                "INFO": "info",
                "WARNING": "warning",
                "ERROR": "error",
                "CRITICAL": "critical",
            }
            level = level_map.get(record.levelname, "info")

            stack = ""
            if record.exc_info:
                stack = "".join(traceback.format_exception(*record.exc_info))

            SystemLog.objects.create(
                level=level,
                source_module=record.name,
                message=self.format(record),
                stack_trace=stack,
            )
        except Exception:
            pass  # Never let logging crash the app