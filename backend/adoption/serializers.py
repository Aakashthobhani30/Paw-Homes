from rest_framework import serializers
from .models import Adoption

class AdoptionSerializers(serializers.ModelSerializer):
    class Meta:
        model = Adoption
        fields ='__all__'

        

