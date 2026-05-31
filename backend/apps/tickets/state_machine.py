from apps.users.models import Role

VALID_TRANSITIONS = {
    'pendiente_evaluacion': [
        ('en_analisis', Role.DIRECTOR,  'Aprobar Solicitud'),
        ('rechazado',   Role.DIRECTOR,  'Rechazar Solicitud'),
    ],
    'en_analisis': [
        ('pendiente_ccb', Role.ANALISTA, 'Escalar a CCB'),
        ('fast_track',    Role.DIRECTOR, 'Fast-Track'),
    ],
    'pendiente_ccb': [
        ('en_desarrollo', Role.CCB, 'CCB Aprueba'),
        ('archivado',     Role.CCB, 'CCB Rechaza'),
    ],
    'fast_track': [
        ('en_desarrollo', Role.DIRECTOR, 'Aprobar e Iniciar Desarrollo'),
    ],
    'en_desarrollo': [
        ('en_qa', Role.DESARROLLADOR, 'Enviar a QA'),
    ],
    'en_qa': [
        ('revision_final', Role.QA, 'QA Aprueba'),
        ('en_desarrollo',  Role.QA, 'QA Rechaza'),
    ],
    'revision_final': [
        ('en_uat',        Role.DIRECTOR, 'Aprobar Merge'),
        ('en_desarrollo', Role.DIRECTOR, 'Rechazar Merge'),
    ],
    'en_uat': [
        ('cerrado',       Role.SOLICITANTE, 'Firmar Conformidad'),
        ('en_desarrollo', Role.SOLICITANTE, 'Solicitar Hotfix'),
    ],
}


class TicketStateMachine:
    def __init__(self, ticket):
        self.ticket = ticket

    def get_available_transitions(self, role_name: str) -> list:
        transitions = VALID_TRANSITIONS.get(self.ticket.status, [])
        return [t for t in transitions if t[1] == role_name]

    def can_transition(self, to_status: str, role_name: str) -> bool:
        available = self.get_available_transitions(role_name)
        return any(t[0] == to_status for t in available)

    def transition(self, to_status: str, role_name: str, user, comment: str = '') -> bool:
        if not self.can_transition(to_status, role_name):
            return False

        from_status = self.ticket.status
        self.ticket.status = to_status
        self.ticket.save(update_fields=['status', 'updated_at'])

        from apps.tickets.models import TicketHistory
        TicketHistory.objects.create(
            ticket=self.ticket,
            changed_by=user,
            from_status=from_status,
            to_status=to_status,
            comment=comment,
        )
        return True
