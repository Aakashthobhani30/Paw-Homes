from django.db import models
from django.contrib.auth.models import User
from product.models import Product
from event.models import Event


    

class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    type = models.CharField(max_length=100)  # 'product' or 'event'
    quantity = models.IntegerField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="cart_items", null=True, blank=True)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="cart_items", null=True, blank=True)
    is_active = models.BooleanField(default=True)  # To mark items as purchased or removed