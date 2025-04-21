from django.db import models



class Industry(models.Model):
    name = models.CharField(max_length=100)


class IndustryTag(models.Model):
    industry = models.ForeignKey(Industry, on_delete=models.CASCADE)
    tag = models.CharField(max_length=100)
    