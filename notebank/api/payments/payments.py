from squareconnect.apis import CustomersApi


ACCESS_TOKEN = 'EAAAEIVttMFBS1mssM-1GOSzRQiVFPQ6h1ECTcpBQcL4MLgmgppw9c3b-jyEUOUo'


customersApi = CustomersApi()
customersApi.api_client.configuration.access_token = ACCESS_TOKEN


def create_customer(email):
    print('Current customers:')
    res = customersApi.de
    print(res)

    print('New Customer: ')
    res = customersApi.create_customer({'email_address': email})
    print(res)
    return
