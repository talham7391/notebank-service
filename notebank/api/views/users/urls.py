from django.urls import path
from . import views
from rest_framework_jwt.views import obtain_jwt_token

urlpatterns = [
    path('users/create-account/', views.CreateAccountView.as_view()),
    path('users/login/', obtain_jwt_token),
    path('users/test/', views.TestAuthView.as_view()),
    path('users/set-card/', views.UserCardView.as_view()),
]
