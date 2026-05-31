from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Ticket, TicketHistory
from .serializers import (
    TicketListSerializer,
    TicketDetailSerializer,
    TicketCreateSerializer,
    TicketTransitionSerializer,
    TicketHistorySerializer,
)
from .state_machine import TicketStateMachine, VALID_TRANSITIONS
from apps.projects.models import Project, ProjectMembership
from apps.users.permissions import IsAnyProjectMember


class TicketListView(generics.ListAPIView):
    serializer_class = TicketListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        project_id = self.request.query_params.get('project_id')
        qs = Ticket.objects.all()
        if project_id:
            qs = qs.filter(project_id=project_id)
        if not self.request.user.is_admin:
            user_projects = ProjectMembership.objects.filter(
                user=self.request.user
            ).values_list('project_id', flat=True)
            qs = qs.filter(project_id__in=user_projects)
        return qs


class TicketCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        project_id = request.data.get('project_id')
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return Response({'error': 'Proyecto no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        serializer = TicketCreateSerializer(
            data=request.data,
            context={'project': project, 'request': request}
        )
        serializer.is_valid(raise_exception=True)
        ticket = serializer.save()
        return Response(TicketDetailSerializer(ticket).data, status=status.HTTP_201_CREATED)


class TicketDetailView(generics.RetrieveAPIView):
    serializer_class = TicketDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Ticket.objects.all()


class TicketTransitionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            ticket = Ticket.objects.get(pk=pk)
        except Ticket.DoesNotExist:
            return Response({'error': 'Ticket no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        serializer = TicketTransitionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        membership = ProjectMembership.objects.filter(
            project=ticket.project, user=request.user
        ).select_related('role').first()

        if not membership and not request.user.is_admin:
            return Response({'error': 'No eres miembro de este proyecto'}, status=status.HTTP_403_FORBIDDEN)

        role_name = membership.role.name if membership else None
        if request.user.is_admin:
            role_name = serializer.validated_data.get('role_override', role_name)

        sm = TicketStateMachine(ticket)
        success = sm.transition(
            to_status=serializer.validated_data['to_status'],
            role_name=role_name,
            user=request.user,
            comment=serializer.validated_data.get('comment', '')
        )

        if not success:
            return Response({'error': 'Transición no válida para tu rol'}, status=status.HTTP_400_BAD_REQUEST)

        return Response(TicketDetailSerializer(ticket).data)


class TicketAvailableTransitionsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            ticket = Ticket.objects.get(pk=pk)
        except Ticket.DoesNotExist:
            return Response({'error': 'Ticket no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        membership = ProjectMembership.objects.filter(
            project=ticket.project, user=request.user
        ).select_related('role').first()

        if not membership:
            return Response([])

        sm = TicketStateMachine(ticket)
        transitions = sm.get_available_transitions(membership.role.name)
        data = [{'to_status': t[0], 'label': t[2]} for t in transitions]
        return Response(data)


class TicketHistoryView(generics.ListAPIView):
    serializer_class = TicketHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TicketHistory.objects.filter(ticket_id=self.kwargs['pk'])
