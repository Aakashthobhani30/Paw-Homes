from rest_framework import serializers
from .models import ContactDetail, ContactForm


class ContactDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactDetail
        fields ='__all__'


class ContactFormListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactForm
        fields ='__all__'


class ContactFormViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactForm
        fields ='__all__'
