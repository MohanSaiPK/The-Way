from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import ClearCartView
from .views import register_user
from .views import ProductViewSet, SupplementViewSet, UserWishlistView, UserCartView
from .views import create_superuser_view

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='products')
router.register(r'supplements', SupplementViewSet, basename='supplements')

urlpatterns = router.urls + [
    path('user/wishlist/', UserWishlistView.as_view(), name='user-wishlist'),
    path('user/cart/', UserCartView.as_view(), name='user-cart'),
    path('register/', register_user, name='register'),
    path('cart/clear/', ClearCartView.as_view(), name='clear-cart'),
    path('create-superuser/', create_superuser_view), 
    
    
]
