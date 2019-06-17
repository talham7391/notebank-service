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
        query_param = self.request.query_params.get('query', None)
        if query_param is None:
            return Course.objects.filter(school=school_id)
        else:
            query = ''.join(query_param.lower().split())
            print(query)
            courses = Course.objects.filter(school=school_id)
            return [
                course
                for course in courses
                if
                query in ''.join(course.course_code.lower().split()) or
                query in ''.join(course.name.lower().split())
            ]
