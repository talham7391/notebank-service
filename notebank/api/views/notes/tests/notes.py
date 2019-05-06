
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from . import utils


class NoteCreationTestCase(APITestCase, utils.NoteUtilsMixin, utils.LoginUtilsMixin):
    login_username = 'john@hotmail.com'
    login_password = 'wefwef'

    def setUp(self):
        utils.load_school_and_course()
        self.do_create_account()

    def tearDown(self):
        u = get_user_model().objects.get(username='john@hotmail.com')
        u.delete()

    def test_user_can_create_note(self):
        self.do_login()

        res = self.post_note()
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        # check the post response
        resdata = res.json()
        note_id = resdata['id']
        expected_response = {
            **self.get_default_note_data(),
            'id': note_id,
            'created_by': self.login_username,
        }
        self.assertDictEqual(expected_response, resdata)

        # check the corresponding get response
        res = self.get_note(note_id)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        resdata = res.json()
        self.assertDictEqual(expected_response, resdata)

        self.do_logout()

    def test_logged_out_user_cant_create_note(self):
        pass

    def test_error_on_wrong_information(self):
        self.do_login()

        bad_data = {
            'title': '',
            'academic_year': 2020,
            'course': 5,
            'price': -1,
        }

        res = self.post_note(**bad_data)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

        self.do_logout()
