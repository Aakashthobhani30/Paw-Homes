from django.shortcuts import render, get_object_or_404
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializers
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework import status
 
from django.http import JsonResponse

def test_cors(request):
    response = JsonResponse({"message": "CORS Test Successful"})
    response["Access-Control-Allow-Origin"] = "*"
    return response

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializers
    permission_classes = [AllowAny]


@api_view(['GET'])
@permission_classes([AllowAny])
def get_user_data(request):
    print("inside user function")
    user = request.user
    print("user", user)

    user_data = {
        "id": user.id,
        "username": user.username,
        "is_staff": user.is_staff,
        "first_name": user.first_name,
        "last_name": user.last_name,
    }
    print("user_data :::::::::::::", user_data)
    return Response(user_data)

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def get_user_data(request):
#     user = request.user  # Get the authenticated user
#     if not user.is_authenticated:
#         return JsonResponse({"error": "User not authenticated"}, status=401)
    
#     try:
#         user_data = {
#             "id": user.id,
#             "username": user.username,
#             "is_staff": user.is_staff,
#         }
#         return Response(user_data)
#     except User.DoesNotExist:
#         return JsonResponse({"error": "User not found"}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_user_data(request):
    user = User.objects.all().values("id", "username", "first_name", "email", "is_staff")
    return Response(list(user))


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Only authenticated users can deactivate users
def deactivate_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        user.is_active = False  # Set is_active to False (0)
        user.save(update_fields=["is_active"])
        return Response({"message": "User deactivated successfully!"}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "User not found!"}, status=status.HTTP_404_NOT_FOUND)
    

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])  # Only authenticated users can deactivate users
def activate_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        user.is_active = True  # Set is_active to False (0)
        user.save(update_fields=["is_active"])
        return Response({"message": "User activated successfully!"}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "User not found!"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_specific_user_data(request, user_id):
    user = get_object_or_404(User, id=user_id)
    data = {
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "last_login": user.last_login,
    }
    return Response(data)