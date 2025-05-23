from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import Category, Product
from .serializers import ProductCategorySerializer, ProductSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404



@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def product_category(request):
    if request.method == 'GET':
        categories = Category.objects.all()
        serializer = ProductCategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'POST':
        serializer = ProductCategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST', 'PATCH'])
@permission_classes([AllowAny])
def product(request, **kwargs):
    if request.method == 'GET':
        products = Product.objects.select_related("created_by").all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'POST':
        data = request.data.copy()
        data['created_by'] = request.user.id
        serializer = ProductSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    if request.method == 'PATCH':
        id = kwargs.get("id")
        data = request.data.copy()
        data['created_by'] = request.user.id
        try:
            product = Product.objects.get(id=id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProductSerializer(product, data=request.data, partial=True)  # Use partial=True for PATCH
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
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
def activate_product(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
        product.status = True
        product.save(update_fields=["status"])
        return Response({"message": "Product activated successfully!"}, status=status.HTTP_200_OK)
    except Product.DoesNotExist:
        return Response({"error": "Product not found!"}, status=status.HTTP_404_NOT_FOUND)

    
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Only authenticated users can deactivate users
def deactivate_product(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
        product.status = False
        product.save(update_fields=["status"])
        return Response({"message": "Product deactivated successfully!"}, status=status.HTTP_200_OK)
    except Product.DoesNotExist:
        return Response({"error": "Product not found!"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_specific_product_data(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    serializer = ProductSerializer(product)  # Use your serializer directly
    return Response(serializer.data, status=status.HTTP_200_OK)