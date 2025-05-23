from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import render, get_object_or_404
from .models import Services, ServicesTag, Category
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import ServicesSerializer, ServicesTagSerializer, ServiceCategorySerializer
from rest_framework.response import Response
from rest_framework import status


@api_view(['GET', 'POST', 'PATCH'])
@permission_classes([AllowAny])
def services(request, **kwargs):
    if request.method == 'GET':
        aboutus = Services.objects.all()
        serializer = ServicesSerializer(aboutus, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'POST':
        serializer = ServicesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    if request.method == 'PATCH':
        id = kwargs.get("id")
        data = request.data.copy()
        data['created_by'] = request.user.id
        try:
            service = Services.objects.get(id=id)
        except Services.DoesNotExist:
            return Response({"error": "Service not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ServicesSerializer(service, data=request.data, partial=True)  # Use partial=True for PATCH
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def servicestag(request):
    if request.method == 'GET':
        aboutus = ServicesTag.objects.all()
        serializer = ServicesTagSerializer(aboutus, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'POST':
        serializer = ServicesTagSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def service_category(request):
    if request.method == 'GET':
        categories = Category.objects.all()
        serializer = ServiceCategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'POST':
        serializer = ServiceCategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Only authenticated users can deactivate users
def activate_category(request, category_id):
    try:
        category = Category.objects.get(id=category_id)
        category.status = True
        category.save(update_fields=["status"])
        return Response({"message": "Category activated successfully!"}, status=status.HTTP_200_OK)
    except Category.DoesNotExist:
        return Response({"error": "Category not found!"}, status=status.HTTP_404_NOT_FOUND)

    
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Only authenticated users can deactivate users
def deactivate_category(request, category_id):
    try:
        category = Category.objects.get(id=category_id)
        category.status = False
        category.save(update_fields=["status"])
        return Response({"message": "Category deactivated successfully!"}, status=status.HTTP_200_OK)
    except Category.DoesNotExist:
        return Response({"error": "Category not found!"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Only authenticated users can deactivate users
def activate_service(request, service_id):
    try:
        event = Services.objects.get(id=service_id)
        event.status = True
        event.save(update_fields=["status"])
        return Response({"message": "Service activated successfully!"}, status=status.HTTP_200_OK)
    except Category.DoesNotExist:
        return Response({"error": "Service not found!"}, status=status.HTTP_404_NOT_FOUND)

    
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Only authenticated users can deactivate users
def deactivate_service(request, service_id):
    try:
        event = Services.objects.get(id=service_id)
        event.status = False
        event.save(update_fields=["status"])
        return Response({"message": "Service deactivated successfully!"}, status=status.HTTP_200_OK)
    except Category.DoesNotExist:
        return Response({"error": "Service not found!"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_specific_service_data(request, service_id):
    service = get_object_or_404(Services, id=service_id)
    serializer = ServicesSerializer(service)  # Use your serializer directly
    return Response(serializer.data, status=status.HTTP_200_OK)
