from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views
from .views import RegisterView, ProfileView, LogoutView

app_name = "users"

urlpatterns = [
    # 🌐 Vues front (HTML)
    path("", views.home, name="home"),
    path("login/", views.login, name="login"),
    path("contact/", views.contact, name="contact"),
    path("comptes/", views.comptes, name="comptes"),
    path("article/", views.articles, name="article"),
    path("promotion/", views.promotions, name="promotion"),

    # 🧠 API REST
    path("api/register/", RegisterView.as_view(), name="register"),
    path("api/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/logout/", LogoutView.as_view(), name="logout"),
    path("api/profile/", ProfileView.as_view(), name="profile"),
]
