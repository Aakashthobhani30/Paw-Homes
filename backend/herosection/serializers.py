from rest_framework import serializers
from .models import Hero

class HeroSerializers(serializers.ModelSerializer):
    class Meta:
            model = Hero
            fields = '__all__'
