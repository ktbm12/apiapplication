# users/urls.py
from django.urls import path
from . import views
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ProductViewSet, ProductImageViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'images', ProductImageViewSet)

from django.urls import path
from . import views_admin

app_name = "catalogue_admin"

urlpatterns = [
    path("", views_admin.admin_dashboard, name="dashboard"),
    path("categories/", views_admin.admin_categories, name="categories"),
     path('products/', views.admin_products, name='products'),  # ✅ nouveau lien
]
