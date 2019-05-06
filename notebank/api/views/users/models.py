from django.db import models
from django.contrib.auth import get_user_model
from api.views.notes.models import Note


class Purchase(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    note = models.ForeignKey(Note, on_delete=models.CASCADE)
