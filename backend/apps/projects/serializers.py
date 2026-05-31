from rest_framework import serializers
from .models import Project, ProjectMembership
from apps.users.serializers import UserPublicSerializer, RoleSerializer


class ProjectMembershipSerializer(serializers.ModelSerializer):
    user = UserPublicSerializer(read_only=True)
    role = RoleSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True)
    role_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = ProjectMembership
        fields = ['id', 'user', 'role', 'user_id', 'role_id', 'joined_at']


class ProjectListSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.get_full_name', read_only=True)
    ticket_count = serializers.IntegerField(read_only=True)
    open_ticket_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'methodology', 'client_name',
                  'ticket_count', 'open_ticket_count', 'is_active', 'created_at']


class ProjectDetailSerializer(serializers.ModelSerializer):
    client = UserPublicSerializer(read_only=True)
    memberships = ProjectMembershipSerializer(many=True, read_only=True)
    client_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'specifications', 'methodology',
                  'client', 'client_id', 'memberships', 'is_active', 'created_at', 'updated_at']

    def create(self, validated_data):
        client_id = validated_data.pop('client_id')
        from apps.users.models import CustomUser
        client = CustomUser.objects.get(id=client_id)
        project = Project.objects.create(client=client, **validated_data)
        from apps.users.models import Role
        solicitante_role = Role.objects.get(name=Role.SOLICITANTE)
        ProjectMembership.objects.create(project=project, user=client, role=solicitante_role)
        return project


class MyProjectSerializer(serializers.Serializer):
    id = serializers.IntegerField(source='project.id')
    name = serializers.CharField(source='project.name')
    role = serializers.CharField(source='role.name')
    role_display = serializers.CharField(source='role.get_name_display')
    methodology = serializers.CharField(source='project.methodology')
