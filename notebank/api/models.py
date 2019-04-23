from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager
from api.payments import payments


class CustomerUserManager(UserManager):
    def create_user(self, username, email=None, password=None, **extra_fields):
        square_id = payments.create_customer(username).id
        return super(CustomerUserManager, self).create_user(username, email, password, square_customer_id=square_id, **extra_fields)


class User(AbstractUser):
    objects = CustomerUserManager()
    square_customer_id = models.CharField(max_length=256)

    def delete(self, using=None, keep_parents=False):
        payments.delete_customer(self.square_customer_id)
        return super(User, self).delete(using, keep_parents)