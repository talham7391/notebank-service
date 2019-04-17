from django.urls import path
from . import views


urlpatterns = [
    path('schools/', views.SchoolsListView.as_view()),
    path('schools/<int:pk>/', views.SchoolRetrieveView.as_view()),
]
