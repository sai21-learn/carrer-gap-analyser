from .celery_utils import celery_app


@celery_app.task
def add(x, y):
    return x + y
