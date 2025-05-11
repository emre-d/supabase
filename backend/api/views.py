from django.shortcuts import render
from rest_framework import viewsets
from .models import *
from .serializers import *
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination

# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

    @action(detail=False, methods=['get'], url_path='by-supa-id/(?P<supa_id>[^/.]+)')
    def get_user_by_supa_id(self, request, supa_id=None):
        try:
            user = CustomUser.objects.get(supa_id=supa_id)
            serializer = self.get_serializer(user)
            return Response(serializer.data)
        except CustomUser.DoesNotExist: 
            return Response({'error': 'User not found'}, status=404)

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    pagination_class = PageNumberPagination
    page_size = 20 
    
    def perform_create(self, serializer):
        user_id = self.request.data.get('user')
        user = CustomUser.objects.get(id=user_id)
        serializer.save(user=user)
    
    