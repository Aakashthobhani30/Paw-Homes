from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now
# Create your models here.

class EventCategory(models.Model):
    name = models.CharField(max_length=100)
    created_on = models.DateTimeField(auto_now_add=True)
    status = models.IntegerField(default=1)


class Event(models.Model):
    category_id = models.ForeignKey(EventCategory, on_delete=models.CASCADE, related_name='event', blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user', blank=True, null=True)
    name = models.CharField(max_length=100, default="")
    description = models.TextField(default="")
    date = models.CharField(max_length=12, default="")
    time = models.CharField(max_length=12, default="")
    location = models.CharField(max_length=100, default="")
    price = models.FloatField()
    image = models.ImageField(upload_to='uploads/', default="")
    duration = models.CharField(max_length=100, default="")
    contact_name = models.CharField(max_length=100, default="")
    contact_number = models.BigIntegerField()
    status = models.IntegerField()
    created_at = models.DateTimeField(default=now, editable=False, blank=True, null=True)


class EventComment(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    