from django.db import models



class Adoption(models.Model):
    pet_name = models.CharField(max_length=100)
    pet_breed = models.CharField(max_length=100)
    pet_age = models.IntegerField()
    pet_gender = models.CharField(max_length=100)
    pet_color = models.CharField(max_length=100)
    pet_personality = models.TextField()
    pet_weight = models.FloatField()
    pet_energylevel = models.CharField(max_length=100)
    pet_disease = models.TextField()
    pet_vaccinatedstatus = models.CharField(max_length=100)
    pet_image = models.ImageField(max_length=100)
    description = models.CharField(max_length=255)
    status = models.BooleanField(default=True)


