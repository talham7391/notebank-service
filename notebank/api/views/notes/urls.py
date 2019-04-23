from .views import NotesViewSet, SheetsViewSet
from rest_framework_nested import routers
from django.urls import path, include


router = routers.SimpleRouter()
router.register('notes', NotesViewSet)

notes_router = routers.NestedSimpleRouter(router, 'notes', lookup='note')
notes_router.register('sheets', SheetsViewSet, base_name='note-sheets')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(notes_router.urls)),
]
