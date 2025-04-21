from rest_framework import serializers
from .models import Industry, IndustryTag


class IndustrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Industry
        fields ='__all__'


class IndustryTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = IndustryTag
        fields ='__all__'


