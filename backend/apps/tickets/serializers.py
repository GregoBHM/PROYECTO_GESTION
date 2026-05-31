from rest_framework import serializers
from .models import Ticket, TicketHistory, TicketAttachment
from apps.users.serializers import UserPublicSerializer


class TicketHistorySerializer(serializers.ModelSerializer):
    changed_by = UserPublicSerializer(read_only=True)
    from_status_display = serializers.CharField(source='get_from_status_display', read_only=True, default='')
    to_status_display = serializers.CharField(source='get_to_status_display', read_only=True, default='')

    class Meta:
        model = TicketHistory
        fields = ['id', 'changed_by', 'from_status', 'to_status',
                  'from_status_display', 'to_status_display', 'comment', 'timestamp']


class TicketAttachmentSerializer(serializers.ModelSerializer):
    uploaded_by = UserPublicSerializer(read_only=True)

    class Meta:
        model = TicketAttachment
        fields = ['id', 'file', 'filename', 'uploaded_by', 'uploaded_at']


class TicketListSerializer(serializers.ModelSerializer):
    requester_name = serializers.CharField(source='requester.get_full_name', read_only=True)
    project_name = serializers.CharField(source='project.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    type_display = serializers.CharField(source='get_request_type_display', read_only=True)

    class Meta:
        model = Ticket
        fields = ['id', 'ticket_id', 'title', 'requester_name', 'project_name',
                  'request_type', 'type_display', 'priority', 'priority_display',
                  'status', 'status_display', 'cost_assignment', 'created_at', 'updated_at']


class TicketDetailSerializer(serializers.ModelSerializer):
    requester = UserPublicSerializer(read_only=True)
    assigned_dev = UserPublicSerializer(read_only=True)
    history = TicketHistorySerializer(many=True, read_only=True)
    attachments = TicketAttachmentSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    type_display = serializers.CharField(source='get_request_type_display', read_only=True)

    class Meta:
        model = Ticket
        fields = ['id', 'ticket_id', 'title', 'description', 'justification',
                  'request_type', 'type_display', 'priority', 'priority_display',
                  'status', 'status_display', 'cost_assignment',
                  'requester', 'assigned_dev',
                  'history', 'attachments',
                  'created_at', 'updated_at']


class TicketCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ['title', 'description', 'justification', 'request_type', 'priority']

    def create(self, validated_data):
        project = self.context['project']
        user = self.context['request'].user
        last_ticket = Ticket.objects.filter(project=project).order_by('-id').first()
        next_num = 1
        if last_ticket:
            try:
                next_num = int(last_ticket.ticket_id.split('-')[1]) + 1
            except (IndexError, ValueError):
                next_num = last_ticket.id + 1
        ticket_id = f'SC-{next_num:04d}'
        ticket = Ticket.objects.create(
            project=project,
            requester=user,
            ticket_id=ticket_id,
            **validated_data
        )
        TicketHistory.objects.create(
            ticket=ticket,
            changed_by=user,
            from_status='',
            to_status=Ticket.STATUS_PENDING_EVAL,
            comment='Solicitud registrada en el sistema'
        )
        return ticket


class TicketTransitionSerializer(serializers.Serializer):
    to_status = serializers.CharField()
    comment = serializers.CharField(required=False, default='')
