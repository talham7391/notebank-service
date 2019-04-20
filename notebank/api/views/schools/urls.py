from django.urls import path
from . import views


urlpatterns = [
    path('', views.SchoolsListView.as_view()),
    path('<int:pk>/', views.SchoolRetrieveView.as_view()),
]
