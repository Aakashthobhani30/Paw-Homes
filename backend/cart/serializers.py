from rest_framework import serializers
from .models import Cart
from product.serializers import ProductSerializer
from event.serializers import EventSerializer
from django.contrib.auth.models import User

class CartSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)
    event_details = EventSerializer(source='event', read_only=True)
    
    class Meta:
        model = Cart
        fields = ['id', 'user', 'type', 'quantity', 'total_amount', 'product', 'product_details', 'event', 'event_details', 'is_active', 'created_at']
        read_only_fields = ['created_at', 'total_amount']

    def validate(self, data):
        if data.get('type') not in ['product', 'event']:
            raise serializers.ValidationError("Type must be either 'product' or 'event'")
        
        if data.get('quantity', 0) <= 0:
            raise serializers.ValidationError("Quantity must be greater than 0")
            
        if data.get('product'):
            # Calculate total amount based on product price and quantity
            data['total_amount'] = data['product'].price * data['quantity']
        elif data.get('event'):
            # Calculate total amount based on event price and quantity
            data['total_amount'] = data['event'].price * data['quantity']
            
        return data