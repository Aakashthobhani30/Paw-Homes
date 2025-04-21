from rest_framework import serializers
from .models import CaseStudy, CaseStudyCategory, CaseStudyComment


class CaseStudySerializer(serializers.ModelSerializer):
    class Meta:
        model = CaseStudy
        fields ='__all__'


class CaseStudyCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CaseStudyCategory
        fields ='__all__'


class CaseStudyCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CaseStudyComment
        fields ='__all__'