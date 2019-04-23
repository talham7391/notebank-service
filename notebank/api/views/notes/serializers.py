from rest_framework import serializers
from . import models
from django.contrib.auth import get_user_model
from api.storage import s3


class NoteSerializer(serializers.ModelSerializer):
    created_by = serializers.SlugRelatedField(queryset=get_user_model().objects.all(), slug_field='username')

    class Meta:
        model = models.Note
        fields = '__all__'


class SheetSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = models.Sheet
        fields = ('id', 'note', 'url')

    def get_url(self, sheet):
        return s3.generate_presigned_download(sheet.hidden_storage_location)


class NewSheetSerializer(serializers.ModelSerializer):
    hidden_upload_url = serializers.SerializerMethodField()
    upload_url = serializers.SerializerMethodField()

    class Meta:
        model = models.Sheet
        fields = ('id', 'note', 'hidden_upload_url', 'upload_url')

    def get_hidden_upload_url(self, sheet):
        return s3.generate_presigned_upload(sheet.hidden_storage_location)

    def get_upload_url(self, sheet):
        return s3.generate_presigned_upload(sheet.storage_location)
