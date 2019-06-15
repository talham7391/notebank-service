from rest_framework import generics, pagination, viewsets
from rest_framework.response import Response
from .serializers import SchoolSerializer, CourseSerializer
from .models import School, Course


class LimitPagination(pagination.LimitOffsetPagination):
    def get_paginated_response(self, data):
        return Response(data)


class SchoolsViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = SchoolSerializer
    pagination_class = LimitPagination
    authentication_classes = []
    permission_classes = []

    def get_queryset(self):
        name = self.request.query_params.get('name', None)
        if name is None:
            return School.objects.all()
        else:
            return School.objects.filter(name__icontains=name)


class IndependentCoursesViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CourseSerializer
    authentication_classes = []
    permission_classes = []
    queryset = Course.objects.all()


class CoursesViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CourseSerializer
    pagination_class = LimitPagination
    authentication_classes = []
    permission_classes = []

    def get_queryset(self):
        school_id = self.kwargs['school_pk']
        course_code = self.request.query_params.get('course_code', None)
        if course_code is None:
            return Course.objects.filter(school=school_id)
        else:
            return Course.objects.filter(course_code__icontains=course_code, school=school_id)
