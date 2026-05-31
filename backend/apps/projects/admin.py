from django.contrib import admin
from .models import Project, ProjectMembership

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'client', 'methodology', 'is_active', 'created_at']
    list_filter = ['methodology', 'is_active']
    search_fields = ['name', 'description']

@admin.register(ProjectMembership)
class ProjectMembershipAdmin(admin.ModelAdmin):
    list_display = ['project', 'user', 'role', 'joined_at']
    list_filter = ['role', 'project']
    search_fields = ['user__username', 'project__name']
