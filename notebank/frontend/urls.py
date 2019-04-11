from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path('notes/create/', views.create_note)
]