from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    supa_id = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.username

class Project(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    members = models.ManyToManyField(CustomUser, related_name='projects_members',null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
