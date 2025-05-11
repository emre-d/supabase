from rest_framework import serializers
from .models import *
from rest_framework.response import Response
from rest_framework.decorators import action

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'supa_id']

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'user','members']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['user'] = instance.user.username
        data['members'] = [member.username for member in instance.members.all()]
        return data

