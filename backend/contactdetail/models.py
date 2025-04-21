from django.db import models
from django.contrib.auth.models import User



class ContactDetail(models.Model):
    name = models.CharField(max_length=100)
    company_description = models.TextField()
    company_address = models.TextField()
    company_contact = models.CharField(max_length=10)
    companu_logo = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=6)
    google_map_url = models.CharField(max_length=255, blank=True, null=True)
    established_year = models.IntegerField()


class ContactForm(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    email = models.CharField(max_length=100, blank=True, null=True)
    title = models.CharField(max_length=100)
    message = models.TextField()
    status = models.IntegerField(default=1)
    created_on = models.DateTimeField(auto_now_add=True)