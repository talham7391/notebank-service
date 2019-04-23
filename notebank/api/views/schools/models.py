from django.db import models


class School(models.Model):
    name = models.fields.CharField(max_length=80, unique=True)


class Course(models.Model):
    name = models.fields.CharField(max_length=150)
    course_code = models.fields.CharField(max_length=20)
    school = models.ForeignKey(School, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('course_code', 'school')
