from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import render,get_object_or_404
from .models import Hero
from .serializers import HeroSerializers
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status 

# Create your views here.
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def hero_list(request):
    if request.method == 'GET':
        heroes = Hero.objects.all()
        serializer = HeroSerializers(heroes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        serializer = HeroSerializers(data=request.data)
        if serializer.is_valid():
            for hero in Hero.objects.all(): 
                image_path = str(hero.image)
                if image_path.startswith("uploads/"):
                    hero.image = image_path.replace("uploads/", "")
                    hero.save()
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH'])
@permission_classes([AllowAny])
def hero_detail(request, id):  # ✅ No "self" needed, use "id" directly
    print("PATCH request received for ID:", id)  # Debugging line

    try:
        hero = Hero.objects.get(id=id)
    except Hero.DoesNotExist:
        return Response({"error": "Hero not found"}, status=status.HTTP_404_NOT_FOUND)

    data = request.data.copy()
    data['created_by'] = request.user.id

    serializer = HeroSerializers(hero, data=data, partial=True)  # ✅ "partial=True" allows partial updates
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_specific_hero_data(request, hero_id):
    hero = get_object_or_404(Hero, id=hero_id)
    serializer = HeroSerializers(hero)  # Use your serializer directly
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Only authenticated users can deactivate users
def activate_hero(request, hero_id):
    try:
        hero= Hero.objects.get(id=hero_id)
        hero.status = True
        hero.save(update_fields=["status"])
        return Response({"message": "Hero activated successfully!"}, status=status.HTTP_200_OK)
    except Hero.DoesNotExist:
        return Response({"error": "Hero not found!"}, status=status.HTTP_404_NOT_FOUND)

    
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Only authenticated users can deactivate users
def deactivate_hero(request, hero_id):
    try:
        hero = Hero.objects.get(id=hero_id)
        hero.status = False
        hero.save(update_fields=["status"])
        return Response({"message": "Hero deactivated successfully!"}, status=status.HTTP_200_OK)
    except Hero.DoesNotExist:
        return Response({"error": "Hero not found!"}, status=status.HTTP_404_NOT_FOUND)