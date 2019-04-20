from .views import NotesViewSet
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register('', NotesViewSet)


urlpatterns = router.urls
