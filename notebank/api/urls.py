from django.urls import path, include


urlpatterns = [
    path('', include('api.views.schools.urls')),
    path('', include('api.views.notes.urls')),
]
