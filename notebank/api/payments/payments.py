from squareconnect.apis import CustomersApi
from squareconnect import models
import os


# ACCESS_TOKEN = os.environ['SQUARE_ACCESS_TOKEN']


customers_api = CustomersApi()
# customers_api.api_client.configuration.access_token = ACCESS_TOKEN


def create_customer(email):
    res = customers_api.create_customer({'email_address': email})
    return res.customer


def list_customers():
    res = customers_api.list_customers()
    return res.customers


def delete_customer(customer_id):
    customers_api.delete_customer(customer_id)


def delete_all_customers():
    res = customers_api.list_customers()
    customers = res.customers
    for c in customers:
        customers_api.delete_customer(c.id)


def retrieve_customer(customer_id):
    res = customers_api.retrieve_customer(customer_id)
    return res.customer


def add_card_for_customer(customer_id, card_nonce):
    body = models.CreateCustomerCardRequest()
    body.card_nonce = card_nonce
    res = customers_api.create_customer_card(customer_id, body)

def delete_all_cards_for_customer(customer_id):
    pass
    # customers_api.delete_customer_card(customer_id)
