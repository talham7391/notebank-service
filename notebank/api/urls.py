from django.urls import path, include


urlpatterns = [
    path('schools/', include('api.views.schools.urls')),
    path('notes/', include('api.views.notes.urls')),
]
