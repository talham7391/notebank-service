from django.contrib.auth.models import AbstractUser, UserManager


class CustomerUserManager(UserManager):
    def create_user(self, username, email=None, password=None, **extra_fields):
        return super(CustomerUserManager, self).create_user(username, email, password, **extra_fields)


class User(AbstractUser):
    objects = CustomerUserManager()

    def delete(self, using=None, keep_parents=False):
        return super(User, self).delete(using, keep_parents)
