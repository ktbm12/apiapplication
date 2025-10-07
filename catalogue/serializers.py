from rest_framework import serializers
from .models import Category, Product, ProductImage


class CategorySerializer(serializers.ModelSerializer):
    """ Sérialiseur pour les catégories """
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']


class ProductImageSerializer(serializers.ModelSerializer):
    """ Sérialiseur pour les images de produits """
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_main']


class ProductSerializer(serializers.ModelSerializer):
    """ Sérialiseur pour les produits """
    category_name = serializers.CharField(source='category.name', read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'title', 'description', 'price', 'stock',
            'category', 'category_name', 'images'
        ]
