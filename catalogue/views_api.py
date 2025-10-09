from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import JsonResponse
from .models import Category, Product, ProductImage
from .serializers import (
    CategorySerializer, ProductSerializer, ProductImageSerializer, 
    ProductImageCreateSerializer
)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related('category').prefetch_related('images').all()
    serializer_class = ProductSerializer


class ProductImageViewSet(viewsets.ModelViewSet):
    queryset = ProductImage.objects.select_related('product').all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ProductImageCreateSerializer
        return ProductImageSerializer
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    @action(detail=True, methods=['post'])
    def set_main(self, request, pk=None):
        """Définir une image comme image principale"""
        image = self.get_object()
        
        # Désactiver toutes les autres images principales du même produit
        ProductImage.objects.filter(
            product=image.product,
            is_main=True
        ).update(is_main=False)
        
        # Activer cette image comme principale
        image.is_main = True
        image.save()
        
        serializer = self.get_serializer(image)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_product(self, request):
        """Récupérer toutes les images d'un produit spécifique"""
        product_id = request.query_params.get('product_id')
        if not product_id:
            return Response(
                {'error': 'product_id parameter is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        images = ProductImage.objects.filter(product_id=product_id)
        serializer = self.get_serializer(images, many=True)
        return Response(serializer.data)
