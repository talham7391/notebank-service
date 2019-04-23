from rest_framework import viewsets
from .models import Note, Sheet, create_sheet
from .serializers import NoteSerializer, SheetSerializer, NewSheetSerializer
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework.mixins import CreateModelMixin
from django.shortcuts import get_object_or_404
from rest_framework import status


class NotesViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer

    def create(self, request, *args, **kwargs):
        self.create_user_if_not_exist(request)
        return super(NotesViewSet, self).create(request, *args, **kwargs)

    @staticmethod
    def create_user_if_not_exist(request):
        s = NoteSerializer(data=request.data)
        if s.is_valid():
            return True
        else:
            if len(s.errors) == 1 and 'created_by' in s.errors:
                created_by_errors = s.errors['created_by']
                if len(created_by_errors) == 1:
                    for err in created_by_errors:
                        if err.code == 'does_not_exist':
                            get_user_model().objects.create_user(username=s.data['created_by'])
                            return True
            return False


class SheetsViewSet(CreateModelMixin, viewsets.ReadOnlyModelViewSet):
    serializer_class = SheetSerializer

    def get_queryset(self):
        return Sheet.objects.filter(note=self.kwargs['note_pk'])

    def list(self, request, *args, **kwargs):
        sheets = self.filter_queryset(self.get_queryset())
        serializer = SheetSerializer(sheets, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        sheet = self.get_object()
        serializer = SheetSerializer(sheet)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        note = get_object_or_404(Note, pk=kwargs['note_pk'])
        sheet = create_sheet(note)
        sheet.save()
        serializer = NewSheetSerializer(sheet)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
