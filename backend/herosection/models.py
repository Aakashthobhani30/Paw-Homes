from django.db import models


class Hero (models.Model):
    image = models.ImageField(upload_to='uploads/', default="")
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255)
    button = models.CharField(max_length=50)
    status = models.IntegerField()
