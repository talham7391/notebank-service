from django.db import models
from api.views.schools.models import Course
from django.contrib.auth import get_user_model
import uuid


class Note(models.Model):
    title = models.CharField(max_length=80)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    academic_year = models.IntegerField()
    created_by = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    price = models.IntegerField()


class Sheet(models.Model):
    note = models.ForeignKey(Note, on_delete=models.CASCADE)
    storage_location = models.CharField(max_length=256)
    is_secret = models.BooleanField()


def create_sheet(note, file_name, is_secret, **kwargs):
    course = note.course
    school = course.school
    uid = str(uuid.uuid4().int)[:5]
    base_location = f'{school.name}/{course.name}/{note.title}/{note.created_by.username}/{uid}'
    storage_location = f'{base_location}-{file_name}'
    sheet = Sheet(
        note=note,
        storage_location=storage_location,
        is_secret=is_secret,
        **kwargs,
    )
    return sheet
