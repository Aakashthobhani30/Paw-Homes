from rest_framework import serializers
from .models import Aboutus


class AboutusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aboutus
        fields ='__all__'