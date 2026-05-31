from rest_framework.permissions import BasePermission
from apps.projects.models import ProjectMembership
from apps.users.models import Role


class IsSystemAdmin(BasePermission):
    message = 'Solo el administrador del sistema puede realizar esta acción.'

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_admin


class IsProjectMemberWithRole(BasePermission):
    required_role = None
    message = 'No tienes el rol requerido en este proyecto.'

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        project_id = (
            view.kwargs.get('project_id') or
            request.query_params.get('project_id') or
            request.data.get('project_id')
        )
        if not project_id:
            return False
        return ProjectMembership.objects.filter(
            project_id=project_id,
            user=request.user,
            role__name=self.required_role
        ).exists()


class IsSolicitante(IsProjectMemberWithRole):
    required_role = Role.SOLICITANTE

class IsDirector(IsProjectMemberWithRole):
    required_role = Role.DIRECTOR

class IsGestorConfig(IsProjectMemberWithRole):
    required_role = Role.GESTOR

class IsAnalista(IsProjectMemberWithRole):
    required_role = Role.ANALISTA

class IsCCB(IsProjectMemberWithRole):
    required_role = Role.CCB

class IsDesarrollador(IsProjectMemberWithRole):
    required_role = Role.DESARROLLADOR

class IsQA(IsProjectMemberWithRole):
    required_role = Role.QA


class IsAnyProjectMember(BasePermission):
    message = 'No eres miembro de este proyecto.'

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        project_id = (
            view.kwargs.get('project_id') or
            request.query_params.get('project_id') or
            request.data.get('project_id')
        )
        if not project_id:
            return False
        return ProjectMembership.objects.filter(
            project_id=project_id,
            user=request.user
        ).exists()
