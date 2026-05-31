from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenBlacklistView
from .views import CustomTokenObtainPairView, RegisterView, MeView, UserListView

urlpatterns = [
    path('login/',   CustomTokenObtainPairView.as_view(), name='auth-login'),
    path('refresh/', TokenRefreshView.as_view(),           name='auth-refresh'),
    path('logout/',  TokenBlacklistView.as_view(),         name='auth-logout'),
    path('register/', RegisterView.as_view(),              name='auth-register'),
    path('me/',      MeView.as_view(),                     name='auth-me'),
    path('users/',   UserListView.as_view(),               name='user-list'),
]
