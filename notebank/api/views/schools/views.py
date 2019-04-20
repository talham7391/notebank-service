from rest_framework import generics, pagination
from rest_framework.response import Response
from .serializers import SchoolSerializer
from .models import School


class LimitPagination(pagination.LimitOffsetPagination):
    def get_paginated_response(self, data):
        return Response(data)


class SchoolsListView(generics.ListAPIView):
    serializer_class = SchoolSerializer
    pagination_class = LimitPagination

    def get_queryset(self):
        name = self.request.query_params.get('name', None)
        if name is None:
            return School.objects.all()
        else:
            return School.objects.filter(name__icontains=name)


class SchoolRetrieveView(generics.RetrieveAPIView):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer
