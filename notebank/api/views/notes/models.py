from django.db import models
from api.views.schools.models import Course
from django.contrib.auth import get_user_model


class Note(models.Model):
    title = models.CharField(max_length=80)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    academic_year = models.IntegerField()
    created_by = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)


class Sheet(models.Model):
    note = models.ForeignKey(Note, on_delete=models.CASCADE)
    storage_location = models.CharField(max_length=256)
    order = models.PositiveSmallIntegerField()
    is_secret = models.BooleanField()
    file_type = models.CharField(max_length=30)
    file_name = models.CharField(max_length=128)

    class Meta:
        unique_together = ('note', 'order')


def create_sheet(note, file_name, is_secret, order, file_type, **kwargs):
    course = note.course
    school = course.school
    base_location = f'{school.name}/{course.name}/{note.title}-{note.id}/{note.created_by.username}/{order}'
    storage_location = f'{base_location}-{file_name}'
    sheet = Sheet(
        note=note,
        storage_location=storage_location,
        is_secret=is_secret,
        order=order,
        file_type=file_type,
        file_name=file_name,
        **kwargs,
    )
    return sheet
