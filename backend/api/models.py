from django.db import models
from django.contrib.auth.models import User

class Product(models.Model):
    CATEGORY_CHOICES = [
        ('product', 'Product'),
        ('supplement', 'Supplement'),
    ]

    name = models.CharField(max_length=255)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    description = models.TextField(blank=True,null=True)
    wishlist = models.BooleanField(default=False)
    wishlist_users = models.ManyToManyField(User, related_name='wishlist', blank=True)
    cart_users = models.ManyToManyField(User, related_name='cart', blank=True)
    price = models.CharField(max_length=20)
    tags = models.TextField(default="")
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='product')  


    def __str__(self):
        return self.name
