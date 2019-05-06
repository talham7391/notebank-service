from api.views.schools.models import School, Course


def load_school_and_course():
    s = School.objects.create(name='University of Waterloo')
    Course.objects.create(name='Introduction to Machine Learning', course_code='CS 480', school=s)


class NoteUtilsMixin:

    def get_notes_endpoint(self):
        return '/api/notes/'

    def get_default_note_data(self):
        return {
            'title': 'Assignment 4 Solutions',
            'academic_year': 2020,
            'course': 1,
            'price': 0,
        }

    def get_note(self, note_id):
        return self.client.get(f'{self.get_notes_endpoint()}{note_id}/')

    def post_note(self, **kwargs):
        return self.client.post(
            self.get_notes_endpoint(),
            {
                **self.get_default_note_data(),
                **kwargs,
            },
        )


class SheetUtilsMixin:

    def get_sheets_endpoint(self, note_id):
        return f'/api/notes/{note_id}/sheets/'

    def post_sheet(self, note_id, file_name, is_secret):
        return self.client.post(
            self.get_sheets_endpoint(note_id),
            {'file_name': file_name, 'is_secret': is_secret},
        )

    def get_sheets(self, note_id):
        return self.client.get(f'{self.get_sheets_endpoint(note_id)}')

    def get_sheet(self, note_id, sheet_id):
        return self.client.get(f'{self.get_sheets_endpoint(note_id)}{sheet_id}/')


class LoginUtilsMixin:
    login_username = None
    login_password = None

    def do_create_account(self):
        self.client.post('/api/users/create-account/', {'username': self.login_username, 'password': self.login_password})

    def do_login(self):
        res = self.client.post('/api/users/login/', {'username': self.login_username, 'password': self.login_password})
        data = res.json()
        self.client.credentials(HTTP_AUTHORIZATION=f'JWT {data["token"]}')

    def do_logout(self):
        self.client.credentials(HTTP_AUTHORIZATION='')
