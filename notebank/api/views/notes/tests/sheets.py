from rest_framework.test import APITestCase, APIClient
from . import utils
from rest_framework import status
import os
import requests
import time


class SheetCreationTestCase(utils.NoteUtilsMixin, utils.SheetUtilsMixin, APITestCase):
    note = None

    def setUp(self):
        utils.load_school_and_course()
        res = self.post_note()
        self.note = res.json()

    def test_can_user_create_and_upload_sheet(self):
        res = self.post_sheet(self.note['id'])
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        data = res.json()

        dir_path = os.path.dirname(os.path.realpath(__file__))
        normal_file = os.path.join(dir_path, 'files', 'test.txt')
        hidden_file = os.path.join(dir_path, 'files', 'test-hidden.txt')

        with open(normal_file, 'rb') as f:
            requests.post(data['upload_url']['url'], data['upload_url']['fields'], files={'file': f})

        with open(hidden_file, 'rb') as f:
            requests.post(data['hidden_upload_url']['url'], data['hidden_upload_url']['fields'], files={'file': f})

        time.sleep(10)

        res = self.get_sheet(self.note['id'], data['id'])
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = res.json()

        url = data['url']
        res = requests.get(url)
        content = res.content

        with open(hidden_file, 'rb') as f:
            file_contents = f.read()
            self.assertEqual(file_contents, content)


# Use the class below to do manual testing in case the automated test isn't working ^
# Sometimes with the automated test you get a "SignatureDoesNotMatch" error.
class CreateSheet(utils.NoteUtilsMixin, utils.SheetUtilsMixin):
    client = APIClient()
    note = None
    sheet_id = None

    def load(self):
        utils.load_school_and_course()

    def run(self):
        res = self.post_note()
        self.note = res.json()

        res = self.post_sheet(self.note['id'])

        data = res.json()
        self.sheet_id = data['id']

        dir_path = os.path.dirname(os.path.realpath(__file__))
        normal_file = os.path.join(dir_path, 'files', 'test.txt')
        hidden_file = os.path.join(dir_path, 'files', 'test-hidden.txt')

        with open(normal_file, 'rb') as f:
            requests.post(data['upload_url']['url'], data['upload_url']['fields'], files={'file': f})

        with open(hidden_file, 'rb') as f:
            requests.post(data['hidden_upload_url']['url'], data['hidden_upload_url']['fields'], files={'file': f})

    def try_get(self):
        res = self.get_sheet(self.note['id'], self.sheet_id)
        data = res.json()

        url = data['url']
        res = requests.get(url)
        print(res.content)
