
from rest_framework.test import APITestCase
from rest_framework import status
from api.views.notes.models import Note
from django.contrib.auth import get_user_model
from . import utils


NOTE_CREATE_DATA = {
    'title': 'Assignment 4 Solutions',
    'academic_year': 2020,
}


class NoteCreationTestCase(APITestCase, utils.NoteUtilsMixin):

    def setUp(self):
        utils.load_school_and_course()
        get_user_model().objects.create_user('john@hotmail.com')

    def tearDown(self):
        u = get_user_model().objects.get(username='john@hotmail.com')
        u.delete()

    def test_nonexistent_user_can_create_note(self):
        res = self.post_note()
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        resdata = res.json()
        note_id = resdata['id']
        expected_response = {
            **self.get_default_note_data(),
            'id': note_id,
        }
        self.assertDictEqual(expected_response, resdata)

        # make sure the notes was created
        res = self.get_note(note_id)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        resdata = res.json()
        self.assertDictEqual(expected_response, resdata)

    def test_user_can_create_note(self):
        email = 'john@hotmail.com'
        res = self.post_note(created_by=email)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        resdata = res.json()
        note_id = resdata['id']
        expected_response = {
            **self.get_default_note_data(),
            'id': note_id,
            'created_by': email,
        }
        self.assertDictEqual(expected_response, resdata)

        # make sure the note was created
        res = self.get_note(note_id)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        resdata = res.json()
        self.assertDictEqual(expected_response, resdata)

    def test_error_on_wrong_information(self):
        email = 'jimmy@gmail.com'
        bad_data = {
            'created_by': email,
            'title': '',
            'academic_year': 2020,
            'course': 5,
        }

        res = self.post_note(**bad_data)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

        try:
            user = get_user_model().objects.get(username=email)
            try:
                Note.objects.get(created_by=user.id)
                raise Exception('This not should not exist')
            except Note.DoesNotExist:
                pass
            raise Exception('This note/user should not exist. Make sure a note isnt being created as well.')
        except get_user_model().DoesNotExist:
            pass
