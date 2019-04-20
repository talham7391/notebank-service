from django.db import models


class Note(models.Model):
    created_by = models.EmailField()
