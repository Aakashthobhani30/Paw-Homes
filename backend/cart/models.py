from django.db import models
from django.contrib.auth.models import User


    

class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    type = models.CharField(max_length=100)
    quantity = models.IntegerField()
    total_amount = models.IntegerField()
    product_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name="cart_product")