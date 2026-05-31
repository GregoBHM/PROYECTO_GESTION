from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.tickets.models import TicketHistory
from apps.projects.models import ProjectMembership
from apps.users.models import Role
from .models import Notification

STATUS_ROLE_MAP = {
    'en_analisis':          Role.GESTOR,
    'pendiente_ccb':        Role.CCB,
    'en_desarrollo':        Role.DESARROLLADOR,
    'en_qa':                Role.QA,
    'revision_final':       Role.DIRECTOR,
    'en_uat':               Role.SOLICITANTE,
}

@receiver(post_save, sender=TicketHistory)
def create_notification_on_transition(sender, instance, created, **kwargs):
    if not created:
        return

    ticket = instance.ticket
    project = ticket.project

    target_role = STATUS_ROLE_MAP.get(instance.to_status)
    if not target_role:
        return

    recipients = ProjectMembership.objects.filter(
        project=project,
        role__name=target_role
    ).select_related('user')

    for membership in recipients:
        Notification.objects.create(
            recipient=membership.user,
            ticket=ticket,
            type='ticket_transition',
            title=f'[{ticket.ticket_id}] Requiere tu acción',
            message=f'El ticket "{ticket.title}" cambió a estado: {instance.to_status}. Acción requerida por tu rol.',
        )
