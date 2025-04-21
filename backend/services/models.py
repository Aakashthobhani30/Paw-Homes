from django.db import models
from datetime import datetime

class Services(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()  # corrected spelling
    image = models.ImageField(upload_to='services/', default="")
    price = models.CharField(max_length=100)  # added price field
    status = models.IntegerField(default=0)
    created_at = models.DateTimeField(default=datetime.now, editable=False)
    created_by = models.CharField(max_length=100, default=0, null=True, blank=True)

class ServicesTag(models.Model):
    services = models.ForeignKey(Services, on_delete=models.CASCADE)
    tag = models.CharField(max_length=100)

class Category(models.Model):
    name = models.CharField(max_length=100)
    status = models.IntegerField()
    created_at = models.DateTimeField(default=datetime.now, editable=False)
    created_by = models.CharField(max_length=100)
