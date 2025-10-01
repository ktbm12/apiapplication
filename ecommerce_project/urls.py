from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/', include('users.urls')),  
    path('orders/', include('orders.urls')),
    path('payments/', include('payments.urls')),
    path('contact/', include('contact.urls')),
    path('catalogue/', include('catalogue.urls')),
]

# gestion des fichiers médias en mode développement
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
