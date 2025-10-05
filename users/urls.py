from django.urls import path
from . import views

app_name = "users"

urlpatterns = [
    path("", views.home, name="home"),
    path("login/", views.login, name="login"),
    path("contact/", views.contact, name="contact"),
    path("comptes/", views.comptes, name="comptes"),
]
