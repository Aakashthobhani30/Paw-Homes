from rest_framework import serializers
from .models import Blog, BlogCategory, BlogComment


class BlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields ='__all__'


class BlogCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogCategory
        fields ='__all__'


class BlogCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogComment
        fields ='__all__'