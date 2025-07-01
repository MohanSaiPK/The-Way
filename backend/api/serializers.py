from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    is_in_wishlist = serializers.SerializerMethodField()
    is_in_cart = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'  # includes id, name, price, image, etc.

    def get_is_in_wishlist(self, obj):
        user = self.context.get('request').user
        return user.is_authenticated and obj.wishlist_users.filter(id=user.id).exists()

    def get_is_in_cart(self, obj):
        user = self.context.get('request').user
        return user.is_authenticated and obj.cart_users.filter(id=user.id).exists()

    def get_category(self, obj):
        return obj.category