from django.db import models
from api.views.schools.models import Course
from django.contrib.auth import get_user_model
import uuid


class Note(models.Model):
    title = models.CharField(max_length=80)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    academic_year = models.IntegerField()
    created_by = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)


class Sheet(models.Model):
    note = models.ForeignKey(Note, on_delete=models.CASCADE)
    storage_location = models.CharField(max_length=256)
    hidden_storage_location = models.CharField(max_length=256)


def create_sheet(note, **kwargs):
    course = note.course
    school = course.school
    uid = uuid.uuid4().int
    base_location = f'{school.name}/{course.name}/{note.title}/{note.created_by.username}/{uid}'
    storage_location = f'{base_location}/normal'
    hidden_storage_location = f'{base_location}/hidden'
    sheet = Sheet(
        note=note,
        storage_location=storage_location,
        hidden_storage_location=hidden_storage_location,
        **kwargs,
    )
    return sheet
