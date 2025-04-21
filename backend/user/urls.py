from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import get_user_data, get_all_user_data,test_cors, activate_user, deactivate_user, get_specific_user_data

urlpatterns = [
    path('', get_user_data, name="get_user_data"),
    path('all-user/', get_all_user_data, name="get_all_user_data"),
    path('test/', test_cors, name='test'),
    path("<int:user_id>/activated", activate_user, name="activate_user"),
    path("<int:user_id>/delete", deactivate_user, name="delete_user"),
    path('<int:user_id>/', get_specific_user_data, name="get_all_users")
]