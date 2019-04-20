from rest_framework import viewsets
from .models import Note
from .serializers import NoteSerializer
from api.payments import payments


class NotesViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer

    def perform_create(self, serializer):
        payments.create_customer(serializer.data['created_by'])
        # serializer.save()
