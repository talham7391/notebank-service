from rest_framework import serializers
from . import models
from django.contrib.auth import get_user_model
from api.storage import s3


class NoteSerializer(serializers.ModelSerializer):
    created_by = serializers.SlugRelatedField(queryset=get_user_model().objects.all(), slug_field='username')

    class Meta:
        model = models.Note
        fields = '__all__'


class NewNoteRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Note
        exclude = ('created_by',)


class SheetSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = models.Sheet
        fields = ('id', 'note', 'url')

    def get_url(self, sheet):
        return s3.generate_presigned_download(sheet.storage_location)


class NewSheetSerializer(serializers.ModelSerializer):
    upload_url = serializers.SerializerMethodField()

    class Meta:
        model = models.Sheet
        fields = ('id', 'note', 'upload_url')

    def get_upload_url(self, sheet):
        return s3.generate_presigned_upload(sheet.storage_location)


class NewSheetRequestSerializer(serializers.Serializer):
    file_name = serializers.CharField()
    is_secret = serializers.BooleanField()
    order = serializers.IntegerField(min_value=0)
