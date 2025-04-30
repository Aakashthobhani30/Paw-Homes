from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import Cart
from .serializers import CartSerializer
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from product.models import Product
from event.models import Event

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart(request):
    """Get user's active cart items"""
    cart_items = Cart.objects.filter(user=request.user, is_active=True)
    serializer = CartSerializer(cart_items, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    """Add a product or event to cart"""
    data = request.data.copy()
    data['user'] = request.user.id
    
    # Check if product or event exists
    product_id = data.get('product')
    event_id = data.get('event')
    
    if product_id:
        try:
            product = Product.objects.get(id=product_id)
            data['type'] = 'product'
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
    elif event_id:
        try:
            event = Event.objects.get(id=event_id)
            data['type'] = 'event'
        except Event.DoesNotExist:
            return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)
    else:
        return Response({"error": "Either product or event ID must be provided"}, status=status.HTTP_400_BAD_REQUEST)
    
    serializer = CartSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_cart_item(request, item_id):
    """Update cart item quantity"""
    cart_item = get_object_or_404(Cart, id=item_id, user=request.user, is_active=True)
    serializer = CartSerializer(cart_item, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request, item_id):
    """Remove item from cart"""
    cart_item = get_object_or_404(Cart, id=item_id, user=request.user, is_active=True)
    cart_item.is_active = False
    cart_item.save()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def complete_purchase(request):
    """Complete the purchase by marking all cart items as inactive"""
    cart_items = Cart.objects.filter(user=request.user, is_active=True)
    if not cart_items.exists():
        return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Mark all items as inactive (purchased)
    cart_items.update(is_active=False)
    
    return Response({"message": "Purchase completed successfully"}, status=status.HTTP_200_OK)