from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import render, get_object_or_404
from .models import CaseStudyCategory, CaseStudy, CaseStudyComment
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import CaseStudyCategorySerializer, CaseStudySerializer, CaseStudyCommentSerializer
from rest_framework.response import Response
from rest_framework import status


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def casestudy(request):
    if request.method == 'GET':
        aboutus = CaseStudy.objects.all()
        serializer = CaseStudySerializer(aboutus, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'POST':
        serializer = CaseStudySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def casestudycategory(request):
    if request.method == 'GET':
        aboutus = CaseStudyCategory.objects.all()
        serializer = CaseStudyCategorySerializer(aboutus, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'POST':
        serializer = CaseStudyCategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def casestudycomment(request):
    if request.method == 'GET':
        aboutus = CaseStudyComment.objects.all()
        serializer = CaseStudyCommentSerializer(aboutus, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'POST':
        serializer = CaseStudyCommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


    