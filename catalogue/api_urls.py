from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.views.decorators.csrf import csrf_exempt
from django.urls.resolvers import URLPattern, URLResolver
from .views_api import CategoryViewSet, ProductViewSet, ProductImageViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'product-images', ProductImageViewSet, basename='product-image')

urlpatterns = router.urls

# On définit les routes API
urlpatterns = [
    path('', include(router.urls)),
]

# Fonction pour désactiver le CSRF sur toutes les routes
def make_urls_csrf_exempt(urlpatterns):
    for pattern in urlpatterns:
        if isinstance(pattern, URLPattern):
            pattern.callback = csrf_exempt(pattern.callback)
        elif isinstance(pattern, URLResolver):
            make_urls_csrf_exempt(pattern.url_patterns)

# On applique la désactivation du CSRF à toutes les vues du routeur
make_urls_csrf_exempt(urlpatterns)
