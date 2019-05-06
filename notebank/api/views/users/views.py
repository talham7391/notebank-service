from api.payments import payments
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from . import serializers
from rest_framework.exceptions import ValidationError, bad_request
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import get_user_model


class UserCardView(APIView):
    def put(self, request):
        user = request.user
        print(user == None)
        # card_nonce = request.data['card_nonce']
        # payments.delete_all_cards_for_customer(pk)
        # payments.add_card_for_customer(pk, card_nonce)
        return Response(status.HTTP_200_OK)


class CreateAccountView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = serializers.UserRequestSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            username = data['username']
            password = data['password']

            try:
                user = get_user_model().objects.get(username=username)
                if not user.has_usable_password():
                    user.set_password(password)
                    user.save()
                else:
                    raise ValidationError('Account with email already exists.')
            except ObjectDoesNotExist:
                get_user_model().objects.create_user(username=username, password=password)

            return Response(status=status.HTTP_201_CREATED)
        else:
            raise ValidationError(serializer.errors)


class TestAuthView(APIView):
    def get(self, _):
        return Response(status=status.HTTP_200_OK)
