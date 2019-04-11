from django.db import models


class School(models.Model):
    name = models.fields.CharField(max_length=80)
