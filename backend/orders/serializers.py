from rest_framework import serializers
from .models import Order, OrderItems
from product.serializers import ProductSerializer
from product.models import Product
from event.models import Event
# from user.models import Address
# from user.serializers import AddressSerializer
from event.models import Event
from event.serializers import EventSerializer
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class OrderSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['id', 'created_at']  # Prevent users from modifying these fields


class OrderItemsSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField()
    event = serializers.SerializerMethodField()

    class Meta:
        model = OrderItems
        fields = ['id', 'user_id', 'order_id', 'item', 'type', 'quantity', 'product', 'event']
        read_only_fields = ['id']  # Prevent modification of ID

    def get_product(self, obj):
        if obj.type == 1:  # If it's a product
            try:
                product = Product.objects.get(id=obj.item)
                return ProductSerializer(product).data
            except Product.DoesNotExist:
                return None
        
        return None
    
    def get_event(self, obj):
        if obj.type == 2:
            try:
                event = Event.objects.get(id=obj.item)
                return EventSerializer(event).data
            except Event.DoesNotExist:
                return None
        return None


