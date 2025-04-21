from rest_framework import serializers
from .models import NewsCategoy, News, NewsComment, NewsLetter


class NewsCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsCategoy
        fields ='__all__'


class NewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields ='__all__'


class NewsCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsComment
        fields ='__all__'


class NewsLetterSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsLetter
        fields ='__all__'