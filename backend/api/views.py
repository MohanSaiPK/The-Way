from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny  
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .models import Product
from .serializers import ProductSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

from django.http import HttpResponse


def ensure_admin_user(request):
    try:
        user, created = User.objects.get_or_create(username='admin')
        user.set_password('adminpass123')  # Reset password every time this runs
        user.is_superuser = True
        user.is_staff = True
        user.email = 'admin@example.com'
        user.save()
        return HttpResponse("✅ Admin user ensured and password reset.")
    except Exception as e:
        return HttpResponse(f"❌ Error: {str(e)}")

@api_view(['POST'])

def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Username and password are required'}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=400)

    user = User.objects.create_user(username=username, password=password)
    return Response({'message': 'User created successfully'}, status=201)

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(category='product')
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'price','tags']
    search_fields = ['name', 'tags']

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def toggle_wishlist(self, request, pk=None):
        product = self.get_object()
        user = request.user
        if user in product.wishlist_users.all():
            product.wishlist_users.remove(user)
            return Response({'status': 'removed from wishlist'})
        else:
            product.wishlist_users.add(user)
            return Response({'status': 'added to wishlist'})

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def toggle_cart(self, request, pk=None):
        product = self.get_object()
        user = request.user
        if user in product.cart_users.all():
            product.cart_users.remove(user)
            return Response({'status': 'removed from cart'})
        else:
            product.cart_users.add(user)
            return Response({'status': 'added to cart'})
    
    @action(detail=False, methods=['post'], url_path='clear_cart')
    def clear_cart(self, request):
        user = request.user
        user.cart.clear()
        return Response({"message": "Cart cleared successfully"})


class SupplementViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(category='supplement')
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'price','tags']
    search_fields = ['name', 'tags']

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def toggle_wishlist(self, request, pk=None):
        supplement = self.get_object()
        user = request.user
        if user in supplement.wishlist_users.all():
            supplement.wishlist_users.remove(user)
            return Response({'status': 'removed from wishlist'})
        else:
            supplement.wishlist_users.add(user)
            return Response({'status': 'added to wishlist'})

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def toggle_cart(self, request, pk=None):
        supplement = self.get_object()
        user = request.user
        if user in supplement.cart_users.all():
            supplement.cart_users.remove(user)
            return Response({'status': 'removed from cart'})
        else:
            supplement.cart_users.add(user)
            return Response({'status': 'added to cart'})
    
    @action(detail=False, methods=['post'], url_path='clear_cart')
    def clear_cart(self, request):
        user = request.user
        user.cart.clear()
        return Response({"message": "Cart cleared successfully"})


class UserWishlistView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        products = Product.objects.filter(wishlist_users=request.user)
        serializer = ProductSerializer(
            products, many=True, context={'request': request}  
        )
        return Response(serializer.data)


class UserCartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        products = Product.objects.filter(cart_users=request.user)
        serializer = ProductSerializer(
            products, many=True, context={'request': request}  
        )
        return Response(serializer.data)
    
class ClearCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        user.cart.clear()       # for products
       
        return Response({"message": "Cart cleared successfully"})
    

