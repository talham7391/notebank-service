from rest_framework.test import APITestCase, APIClient
from . import utils
from rest_framework import status


class SheetCreationTestCase(utils.NoteUtilsMixin, utils.SheetUtilsMixin, utils.LoginUtilsMixin, APITestCase):
    login_username = 'john@hotmail.com'
    login_password = 'wefwef'
    note = None

    def setUp(self):
        utils.load_school_and_course()
        self.do_create_account()
        self.do_login()
        res = self.post_note()
        self.note = res.json()
        self.do_logout()

    def test_can_user_create_and_upload_sheet(self):
        self.do_login()

        # create a sheet for a note
        res = self.post_sheet(self.note['id'], 'testing', True)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        # make sure an upload url is present in the response
        data = res.json()
        self.assertEqual(data['note'], self.note['id'])
        self.assertIn('upload_url', data)

        self.do_logout()

    def test_user_can_only_create_a_sheet_to_their_own_note(self):
        temp = self.login_username
        self.login_username = 'account1@hotmail.com'
        self.do_create_account()
        self.do_login()

        account1_note = self.post_note().json()

        self.do_logout()

        self.login_username = 'account2@gmail.com'
        self.do_create_account()
        self.do_login()

        account2_note = self.post_note().json()

        res = self.post_sheet(account2_note['id'], 'testing', False)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        res = self.post_sheet(account1_note['id'], 'testing', False)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

        self.do_logout()
        self.login_username = temp

    def test_user_can_access_all_sheets_made_by_him(self):
        self.do_login()
        visible_sheet = self.post_sheet(self.note['id'], 'visible note', False).json()
        hidden_sheet = self.post_sheet(self.note['id'], 'hidden note', True).json()

        res = self.get_sheet(self.note['id'], visible_sheet['id'])
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = res.json()
        self.assertIn('url', data)

        res = self.get_sheet(self.note['id'], hidden_sheet['id'])
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = res.json()
        self.assertIn('url', data)

    def test_user_can_access_public_sheets_made_by_other_people(self):
        self.do_login()
        sheet_id = self.post_sheet(self.note['id'], 'visible_sheet', False).json()['id']
        self.do_logout()

        self.login_username = 'test@hotmail.com'
        self.do_create_account()
        self.do_login()
        res = self.get_sheet(self.note['id'], sheet_id)
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_user_can_not_access_secret_sheets_made_by_other_people(self):
        self.do_login()
        sheet_id = self.post_sheet(self.note['id'], 'visible_sheet', True).json()['id']
        self.do_logout()

        self.login_username = 'test@hotmail.com'
        self.do_create_account()
        self.do_login()
        res = self.get_sheet(self.note['id'], sheet_id)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        self.do_logout()

    def test_user_is_only_sent_public_sheets_made_by_other_people(self):
        self.do_login()
        visible1_id = self.post_sheet(self.note['id'], 'visible_sheet', False).json()['id']
        visible2_id = self.post_sheet(self.note['id'], 'visible_sheet', False).json()['id']
        self.post_sheet(self.note['id'], 'hidden_sheet', True)
        self.do_logout()

        self.login_username = 'test@hotmail.com'
        self.do_create_account()
        self.do_login()
        sheets = self.get_sheets(self.note['id']).json()
        self.assertEqual(len(sheets), 2)
        self.assertTrue(len([x for x in sheets if x['id'] == visible1_id]) == 1)
        self.assertTrue(len([x for x in sheets if x['id'] == visible2_id]) == 1)


# Use the class below to do manual testing in case the automated test isn't working ^
# Sometimes with the automated test you get a "SignatureDoesNotMatch" error.

# dir_path = os.path.dirname(os.path.realpath(__file__))
# normal_file = os.path.join(dir_path, 'files', 'test.txt')
# hidden_file = os.path.join(dir_path, 'files', 'test-hidden.txt')
#
# with open(normal_file, 'rb') as f:
#     requests.post(data['upload_url']['url'], data['upload_url']['fields'], files={'file': f})
#
# with open(hidden_file, 'rb') as f:
#     requests.post(data['hidden_upload_url']['url'], data['hidden_upload_url']['fields'], files={'file': f})
#
# time.sleep(10)
#
# res = self.get_sheet(self.note['id'], data['id'])
# self.assertEqual(res.status_code, status.HTTP_200_OK)
# data = res.json()
#
# url = data['url']
# res = requests.get(url)
# content = res.content
#
# with open(hidden_file, 'rb') as f:
#     file_contents = f.read()
#     self.assertEqual(file_contents, content)

# class CreateSheet(utils.NoteUtilsMixin, utils.SheetUtilsMixin):
#     client = APIClient()
#     note = None
#     sheet_id = None
#
#     def load(self):
#         utils.load_school_and_course()
#
#     def run(self):
#         res = self.post_note()
#         self.note = res.json()
#
#         res = self.post_sheet(self.note['id'], 'testing')
#
#         data = res.json()
#         self.sheet_id = data['id']
#
#         dir_path = os.path.dirname(os.path.realpath(__file__))
#         normal_file = os.path.join(dir_path, 'files', 'test.txt')
#         hidden_file = os.path.join(dir_path, 'files', 'test-hidden.txt')
#
#         with open(normal_file, 'rb') as f:
#             requests.post(data['upload_url']['url'], data['upload_url']['fields'], files={'file': f})
#
#         with open(hidden_file, 'rb') as f:
#             requests.post(data['hidden_upload_url']['url'], data['hidden_upload_url']['fields'], files={'file': f})
#
#     def try_get(self):
#         res = self.get_sheet(self.note['id'], self.sheet_id)
#         data = res.json()
#
#         url = data['url']
#         res = requests.get(url)
#         print(res.content)
