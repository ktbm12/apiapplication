from rest_framework import serializers
from .models import Category, Product, ProductImage


class CategorySerializer(serializers.ModelSerializer):
    """ Sérialiseur pour les catégories """
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']


class ProductImageSerializer(serializers.ModelSerializer):
    """ Sérialiseur pour les images de produits """
    product_title = serializers.CharField(source='product.title', read_only=True)
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductImage
        fields = ['id', 'product', 'product_title', 'image', 'image_url', 'alt_text', 'is_main', 'created']
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class ProductImageCreateSerializer(serializers.ModelSerializer):
    """ Sérialiseur pour la création d'images de produits """
    class Meta:
        model = ProductImage
        fields = ['product', 'image', 'alt_text', 'is_main']
    
    def create(self, validated_data):
        # Si cette image est définie comme principale, désactiver les autres images principales du même produit
        if validated_data.get('is_main', False):
            ProductImage.objects.filter(
                product=validated_data['product'],
                is_main=True
            ).update(is_main=False)
        
        return super().create(validated_data)


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
