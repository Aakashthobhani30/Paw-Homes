from rest_framework import serializers
from .models import Services, ServicesTag, Category


class ServicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Services
        fields ='__all__'


class ServicesTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServicesTag
        fields ='__all__'


class ServiceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields  = '__all__'

    def validate_name(self, value):
        value = value.strip()  # Remove leading/trailing spaces
        if Category.objects.filter(name__iexact=value).exists():  # Case-insensitive check
            raise serializers.ValidationError("Name already exists. Please use a different name.")
        return value
