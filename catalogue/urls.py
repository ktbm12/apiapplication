# catalogue/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views_admin
from .views_api import CategoryViewSet, ProductViewSet, ProductImageViewSet

# Router pour les vues d'administration
admin_router = DefaultRouter()
admin_router.register(r'categories', CategoryViewSet, basename='admin-category')
admin_router.register(r'products', ProductViewSet, basename='admin-product')
admin_router.register(r'images', ProductImageViewSet, basename='admin-image')

app_name = "catalogue_admin"

urlpatterns = [
    path("", views_admin.admin_dashboard, name="dashboard"),
    path("categories/", views_admin.admin_categories, name="categories"),
    path("products/", views_admin.admin_products, name="products"),
    path("images/", views_admin.admin_images, name="images"),
    
    # URLs API pour l'administration
    path("api/", include(admin_router.urls)),
]