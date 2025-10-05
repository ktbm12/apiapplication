from django.urls import path
from . import views
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, ProfileView, LogoutView
app_name = "users"

urlpatterns = [
    path("", views.home, name="home"),
    path("login/", views.login, name="login"),
    path("contact/", views.contact, name="contact"),
    path("comptes/", views.comptes, name="comptes"),
    path("article/", views.articles, name="article"),
    path("promotion/", views.promotions, name="promotion"),
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", TokenObtainPairView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("profile/", ProfileView.as_view(), name="profile"),
]

