from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path('notes/create/', views.create_note),
    path('notes/browse/', views.browse_notes),
    path('login/', views.login),
    path('create-account/', views.create_account),
    path('account/', views.account)
]
