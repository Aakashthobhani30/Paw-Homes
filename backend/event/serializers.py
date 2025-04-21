from rest_framework import serializers
from .models import EventCategory, Event, EventComment


class EventCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = EventCategory
        fields ='__all__'


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields ='__all__'


class EventCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventComment
        fields ='__all__'
