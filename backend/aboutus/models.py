from django.db import models


class Aboutus(models.Model):
    title = models.TextField()
    content = models.TextField() 