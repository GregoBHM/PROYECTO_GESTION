from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Project, ProjectMembership
from .serializers import (
    ProjectListSerializer,
    ProjectDetailSerializer,
    ProjectMembershipSerializer,
    MyProjectSerializer,
)
from apps.users.permissions import IsSystemAdmin
from apps.users.models import Role


class ProjectListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProjectDetailSerializer
        return ProjectListSerializer

    def get_queryset(self):
        if self.request.user.is_admin:
            return Project.objects.all()
        project_ids = ProjectMembership.objects.filter(
            user=self.request.user
        ).values_list('project_id', flat=True)
        return Project.objects.filter(id__in=project_ids)

    def perform_create(self, serializer):
        if not self.request.user.is_admin:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Solo el administrador puede crear proyectos.")
        serializer.save()


class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProjectDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Project.objects.all()


class ProjectMemberCreateView(generics.CreateAPIView):
    serializer_class = ProjectMembershipSerializer
    permission_classes = [permissions.IsAuthenticated, IsSystemAdmin]

    def perform_create(self, serializer):
        project = Project.objects.get(id=self.kwargs['pk'])
        serializer.save(project=project)


class ProjectMemberDeleteView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, IsSystemAdmin]
    queryset = ProjectMembership.objects.all()
    lookup_url_kwarg = 'membership_id'


class MyProjectsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        memberships = ProjectMembership.objects.filter(
            user=request.user,
            project__is_active=True
        ).select_related('project', 'role')
        serializer = MyProjectSerializer(memberships, many=True)
        return Response(serializer.data)
