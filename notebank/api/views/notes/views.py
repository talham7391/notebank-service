from rest_framework import viewsets
from .models import Note, Sheet, create_sheet
from . import serializers
from rest_framework.response import Response
from rest_framework.mixins import CreateModelMixin
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import action
from api.views import utils
from rest_framework.permissions import BasePermission


class ReadOnlyOrAuthenticatedPermission(BasePermission):
    def has_permission(self, request, view):
        if view.action == 'list' or view.action == 'retrieve':
            return True
        else:
            return request.user.is_authenticated


class NotesViewSet(viewsets.ModelViewSet):
    permission_classes = [ReadOnlyOrAuthenticatedPermission]
    queryset = Note.objects.all()
    serializer_class = serializers.NoteSerializer

    def create(self, request, *args, **kwargs):
        serializer = serializers.NewNoteRequestSerializer(data=request.data)
        if serializer.is_valid():
            note = Note(**serializer.validated_data, created_by=request.user)
            note.save()
            res_serializer = serializers.NoteSerializer(note)
            return Response(res_serializer.data, status=status.HTTP_201_CREATED)
        else:
            raise ValidationError(serializer.errors)

    @action(methods=['GET'], detail=False)
    def authenticated(self, request):
        notes = Note.objects.filter(created_by=request.user)
        serializer = serializers.NoteSerializer(notes, many=True)
        return Response(serializer.data)


class SheetsViewSet(CreateModelMixin, viewsets.ReadOnlyModelViewSet):
    permission_classes = []
    serializer_class = serializers.SheetSerializer

    def get_queryset(self):
        return Sheet.objects.filter(note=self.kwargs['note_pk'])

    def list(self, request, *args, **kwargs):
        sheets = self.filter_queryset(self.get_queryset())
        visible_sheets = filter(lambda s: not s.is_secret, sheets)
        serializer = serializers.SheetSerializer(visible_sheets, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        sheet = self.get_object()
        if sheet.is_secret and not utils.can_user_access_sheet(request.user, sheet):
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = serializers.SheetSerializer(sheet)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        request_serializer = serializers.NewSheetRequestSerializer(data=request.data)
        if request_serializer.is_valid():
            data = request_serializer.validated_data
            note = get_object_or_404(Note, pk=kwargs['note_pk'])

            if not utils.can_user_create_sheet(request.user, note):
                return Response(status=status.HTTP_403_FORBIDDEN)

            sheet = create_sheet(note, data['file_name'], data['is_secret'], data['order'])
            sheet.save()
            serializer = serializers.NewSheetSerializer(sheet)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            raise ValidationError(request_serializer.errors)
