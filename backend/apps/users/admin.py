from django.contrib import admin
from .models import CustomUser, Role

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'is_admin', 'is_active']
    list_filter = ['is_admin', 'is_active']
    search_fields = ['username', 'email', 'first_name', 'last_name']

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']
