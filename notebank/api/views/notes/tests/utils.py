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
            'created_by': 'test@user.com',
            'course': 1,
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
            format='json',
        )


class SheetUtilsMixin:

    def get_sheets_endpoint(self, note_id):
        return f'/api/notes/{note_id}/sheets/'

    def post_sheet(self, note_id):
        return self.client.post(self.get_sheets_endpoint(note_id))

    def get_sheet(self, note_id, sheet_id):
        return self.client.get(f'{self.get_sheets_endpoint(note_id)}{sheet_id}/')
