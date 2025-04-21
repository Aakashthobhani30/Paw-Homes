from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import render, get_object_or_404
from .models import BlogComment, Blog, BlogCategory
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import BlogCategorySerializer, BlogSerializer, BlogCommentSerializer
from rest_framework.response import Response
from rest_framework import status


@api_view(['GET', 'POST', 'PATCH'])
@permission_classes([IsAuthenticated])
def blog(request, **kwargs):
    if request.method == 'PATCH':
     print("PATCH request received")
    if request.method == 'GET':
        aboutus = Blog.objects.all()
        serializer = BlogSerializer(aboutus, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'POST':
        serializer = BlogSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    if request.method == 'PATCH':
        id = kwargs.get("id")
        data = request.data.copy()
        data['created_by'] = request.user.id
        try:
            blog = Blog.objects.get(id=id)
        except Blog.DoesNotExist:
            return Response({"error": "Blog not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = BlogSerializer(blog, data=request.data, partial=True)  # Use partial=True for PATCH
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def blogcategory(request):
    if request.method == 'GET':
        aboutus = BlogCategory.objects.all()
        serializer = BlogCategorySerializer(aboutus, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'POST':
        serializer = BlogCategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def blogcomment(request):
    if request.method == 'GET':
        aboutus = BlogComment.objects.all()
        serializer = BlogCommentSerializer(aboutus, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'POST':
        serializer = BlogCommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Only authenticated users can deactivate users
def activate_category(request, category_id):
    try:
        category = BlogCategory.objects.get(id=category_id)
        category.status = True
        category.save(update_fields=["status"])
        return Response({"message": "Category activated successfully!"}, status=status.HTTP_200_OK)
    except BlogCategory.DoesNotExist:
        return Response({"error": "Category not found!"}, status=status.HTTP_404_NOT_FOUND)

    
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Only authenticated users can deactivate users
def deactivate_category(request, category_id):
    try:
        category = BlogCategory.objects.get(id=category_id)
        category.status = False
        category.save(update_fields=["status"])
        return Response({"message": "Category deactivated successfully!"}, status=status.HTTP_200_OK)
    except BlogCategory.DoesNotExist:
        return Response({"error": "Category not found!"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Only authenticated users can deactivate users
def activate_blog(request, blog_id):
    try:
        blog = Blog.objects.get(id=blog_id)
        blog.status = True
        blog.save(update_fields=["status"])
        return Response({"message": "Blog activated successfully!"}, status=status.HTTP_200_OK)
    except BlogCategory.DoesNotExist:
        return Response({"error": "Blog not found!"}, status=status.HTTP_404_NOT_FOUND)

    
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Only authenticated users can deactivate users
def deactivate_blog(request, blog_id):
    try:
        blog = Blog.objects.get(id=blog_id)
        blog.status = False
        blog.save(update_fields=["status"])
        return Response({"message": "Blog deactivated successfully!"}, status=status.HTTP_200_OK)
    except BlogCategory.DoesNotExist:
        return Response({"error": "Blog not found!"}, status=status.HTTP_404_NOT_FOUND)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_specific_blog_data(request, blog_id):
    blog = get_object_or_404(Blog, id=blog_id)
    serializer = BlogSerializer(blog)  # Use your serializer directly
    return Response(serializer.data, status=status.HTTP_200_OK)