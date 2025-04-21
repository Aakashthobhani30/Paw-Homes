from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from .models import Adoption
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import AdoptionSerializers
from rest_framework.response import Response
from rest_framework import status


@api_view(['GET', 'POST', 'PATCH'])
@permission_classes([AllowAny])
def adoption(request, **kwargs):
    if request.method == 'GET':
        adoptions = Adoption.objects.all()
        serializer = AdoptionSerializers(adoptions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'POST':
        serializer = AdoptionSerializers(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'PATCH':
        id = kwargs.get("id")
        try:
            adoption = Adoption.objects.get(id=id)
        except Adoption.DoesNotExist:
            return Response({"error": "Adoption record not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = AdoptionSerializers(adoption, data=request.data, partial=True)  # partial update
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def activate_adoption(request, adoption_id):
    try:
        adoption = Adoption.objects.get(id=adoption_id)
        adoption.status = True
        adoption.save(update_fields=["status"])
        return Response({"message": "Adoption activated successfully!"}, status=status.HTTP_200_OK)
    except Adoption.DoesNotExist:
        return Response({"error": "Adoption record not found!"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def deactivate_adoption(request, adoption_id):
    try:
        adoption = Adoption.objects.get(id=adoption_id)
        adoption.status = False
        adoption.save(update_fields=["status"])
        return Response({"message": "Adoption deactivated successfully!"}, status=status.HTTP_200_OK)
    except Adoption.DoesNotExist:
        return Response({"error": "Adoption record not found!"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_specific_adoption_data(request, adoption_id):
    adoption = get_object_or_404(Adoption, id=adoption_id)
    serializer = AdoptionSerializers(adoption)
    return Response(serializer.data, status=status.HTTP_200_OK)
