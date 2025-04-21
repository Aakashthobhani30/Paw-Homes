from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import render, get_object_or_404
from .models import NewsCategoy, News, NewsComment, NewsLetter
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import NewsCategorySerializer, NewsSerializer, NewsCommentSerializer, NewsLetterSerializer
from rest_framework.response import Response
from rest_framework import status


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def newscategors(request):
    if request.method == 'GET':
        aboutus = NewsCategoy.objects.all()
        serializer = NewsCategorySerializer(aboutus, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'POST':
        serializer = NewsCategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def news(request):
    if request.method == 'GET':
        aboutus = News.objects.all()
        serializer = NewsSerializer(aboutus, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'POST':
        serializer = NewsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def newscomment(request):
    if request.method == 'GET':
        aboutus = NewsComment.objects.all()
        serializer = NewsCommentSerializer(aboutus, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'POST':
        serializer = NewsCommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def newsletter(request):
    if request.method == 'GET':
        aboutus = NewsLetter.objects.all()
        serializer = NewsLetterSerializer(aboutus, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'POST':
        serializer = NewsLetterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)