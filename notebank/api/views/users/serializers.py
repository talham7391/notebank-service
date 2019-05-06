from rest_framework import serializers


class UserRequestSerializer(serializers.Serializer):
    username = serializers.EmailField()
    password = serializers.CharField()
