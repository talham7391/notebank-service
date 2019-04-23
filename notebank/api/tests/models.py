from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from api.payments import payments


class UserManagementTestCase(APITestCase):

    def test_can_create_and_delete_user_with_square_id(self):
        user = get_user_model().objects.create_user('test@hotmail.com')
        square_id = user.square_customer_id
        customer = payments.retrieve_customer(square_id)
        self.assertEqual(customer.email_address, user.username)

        user.delete()
        customers = payments.list_customers()
        for c in customers:
            self.assertNotEqual(c.id, square_id)
