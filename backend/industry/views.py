from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import render, get_object_or_404
from .models import Industry, IndustryTag
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import IndustrySerializer, IndustryTagSerializer
from rest_framework.response import Response
from rest_framework import status


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def industry(request):
    if request.method == 'GET':
        aboutus = Industry.objects.all()
        serializer = IndustrySerializer(aboutus, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'POST':
        serializer = IndustrySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def industrytag(request):
    if request.method == 'GET':
        aboutus = IndustryTag.objects.all()
        serializer = IndustryTagSerializer(aboutus, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'POST':
        serializer = IndustryTagSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

