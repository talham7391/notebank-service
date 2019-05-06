from django.urls import path, include
from . import views
from rest_framework_nested import routers

router = routers.SimpleRouter()
router.register('schools', views.SchoolsViewSet, base_name='schools')

schools_router = routers.NestedSimpleRouter(router, 'schools', lookup='school')
schools_router.register('courses', views.CoursesViewSet, base_name='courses')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(schools_router.urls)),
]
