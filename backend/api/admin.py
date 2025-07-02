# api/admin.py

from django.contrib import admin
from .models import Product

class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'category','tags')
    list_filter = ('category',)
    search_fields = ('name', 'tags')
    fields=('name','image', 'price', 'category','tags','description')
    
    def wishlist_users_count(self, obj):
        return obj.wishlist_users.count()
    wishlist_users_count.short_description = "Wishlist Count"

    def cart_users_count(self, obj):
        return obj.cart_users.count()
    cart_users_count.short_description = "Cart Count"

admin.site.register(Product, ProductAdmin)


    