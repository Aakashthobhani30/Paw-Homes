from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import render, get_object_or_404
from .models import EventCategory, Event, EventComment
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import EventCategorySerializer, EventSerializer, EventCommentSerializer
from rest_framework.response import Response
from rest_framework import status
from .models import EventCategory, Event


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def eventcategory(request):
    if request.method == 'GET':
        aboutus = EventCategory.objects.all()
        serializer = EventCategorySerializer(aboutus, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'POST':
        serializer = EventCategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    
    

@api_view(['GET', 'POST', 'PATCH'])
@permission_classes([AllowAny])
def event(request, **kwargs):
    if request.method == 'GET':
        aboutus = Event.objects.all()
        serializer = EventSerializer(aboutus, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'POST':
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            for event in Event.objects.all(): 
                image_path = str(event.image)
                if image_path.startswith("uploads/"):
                    event.image = image_path.replace("uploads/", "")
                    event.save()
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    if request.method == 'PATCH':
        id = kwargs.get("id")
        data = request.data.copy()
        data['created_by'] = request.user.id
        try:
            service = Event.objects.get(id=id)
        except Event.DoesNotExist:
            return Response({"error": "Service not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = EventSerializer(service, data=request.data, partial=True)  # Use partial=True for PATCH
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_specific_event_data(request, event_id):
    event = get_object_or_404(Event, id=event_id)
    serializer = EventSerializer(event)  # Use your serializer directly
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Only authenticated users can deactivate users
def activate_category(request, category_id):
    try:
        category = EventCategory.objects.get(id=category_id)
        category.status = True
        category.save(update_fields=["status"])
        return Response({"message": "Category activated successfully!"}, status=status.HTTP_200_OK)
    except EventCategory.DoesNotExist:
        return Response({"error": "Category not found!"}, status=status.HTTP_404_NOT_FOUND)

    
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Only authenticated users can deactivate users
def deactivate_category(request, category_id):
    try:
        category = EventCategory.objects.get(id=category_id)
        category.status = False
        category.save(update_fields=["status"])
        return Response({"message": "Category deactivated successfully!"}, status=status.HTTP_200_OK)
    except EventCategory.DoesNotExist:
        return Response({"error": "Category not found!"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Only authenticated users can deactivate users
def activate_event(request, event_id):
    try:
        event = Event.objects.get(id=event_id)
        event.status = True
        event.save(update_fields=["status"])
        return Response({"message": "Event activated successfully!"}, status=status.HTTP_200_OK)
    except EventCategory.DoesNotExist:
        return Response({"error": "Event not found!"}, status=status.HTTP_404_NOT_FOUND)

    
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Only authenticated users can deactivate users
def deactivate_event(request, event_id):
    try:
        event = Event.objects.get(id=event_id)
        event.status = False
        event.save(update_fields=["status"])
        return Response({"message": "Event deactivated successfully!"}, status=status.HTTP_200_OK)
    except EventCategory.DoesNotExist:
        return Response({"error": "Event not found!"}, status=status.HTTP_404_NOT_FOUND)
