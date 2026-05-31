from django.db import models
from apps.users.models import CustomUser
from apps.projects.models import Project


class Ticket(models.Model):
    TYPE_BUG         = 'bug'
    TYPE_ENHANCEMENT = 'mejora'
    TYPE_FEATURE     = 'feature'
    TYPE_CHOICES = [
        (TYPE_BUG,         'Reporte de Error (Bug)'),
        (TYPE_ENHANCEMENT, 'Mejora de Funcionalidad'),
        (TYPE_FEATURE,     'Nuevo Requerimiento (Feature)'),
    ]

    PRIORITY_LOW      = 'baja'
    PRIORITY_MEDIUM   = 'media'
    PRIORITY_HIGH     = 'alta'
    PRIORITY_CRITICAL = 'critica'
    PRIORITY_CHOICES = [
        (PRIORITY_LOW,      'Baja'),
        (PRIORITY_MEDIUM,   'Media'),
        (PRIORITY_HIGH,     'Alta'),
        (PRIORITY_CRITICAL, 'Crítica'),
    ]

    STATUS_PENDING_EVAL    = 'pendiente_evaluacion'
    STATUS_REJECTED        = 'rechazado'
    STATUS_IN_ANALYSIS     = 'en_analisis'
    STATUS_PENDING_CCB     = 'pendiente_ccb'
    STATUS_FAST_TRACK      = 'fast_track'
    STATUS_IN_DEVELOPMENT  = 'en_desarrollo'
    STATUS_IN_QA           = 'en_qa'
    STATUS_FINAL_REVIEW    = 'revision_final'
    STATUS_IN_UAT          = 'en_uat'
    STATUS_CLOSED          = 'cerrado'
    STATUS_ARCHIVED        = 'archivado'

    STATUS_CHOICES = [
        (STATUS_PENDING_EVAL,   'Pendiente de Evaluación'),
        (STATUS_REJECTED,       'Rechazado'),
        (STATUS_IN_ANALYSIS,    'En Análisis Técnico'),
        (STATUS_PENDING_CCB,    'Pendiente de CCB'),
        (STATUS_FAST_TRACK,     'Fast-Track'),
        (STATUS_IN_DEVELOPMENT, 'En Desarrollo'),
        (STATUS_IN_QA,          'En Control de Calidad'),
        (STATUS_FINAL_REVIEW,   'Revisión Técnica Final'),
        (STATUS_IN_UAT,         'Pruebas de Aceptación (UAT)'),
        (STATUS_CLOSED,         'Cerrado'),
        (STATUS_ARCHIVED,       'Archivado'),
    ]

    COST_CLIENT   = 'cliente'
    COST_INTERNAL = 'interno'
    COST_CHOICES = [
        (COST_CLIENT,   'Asumido por el Cliente'),
        (COST_INTERNAL, 'Asumido Internamente'),
    ]

    project         = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tickets')
    requester       = models.ForeignKey(CustomUser, on_delete=models.PROTECT, related_name='created_tickets')
    ticket_id       = models.CharField(max_length=20, unique=True)
    title           = models.CharField(max_length=300)
    description     = models.TextField()
    justification   = models.TextField()
    request_type    = models.CharField(max_length=20, choices=TYPE_CHOICES)
    priority        = models.CharField(max_length=20, choices=PRIORITY_CHOICES)
    status          = models.CharField(max_length=30, choices=STATUS_CHOICES, default=STATUS_PENDING_EVAL)
    cost_assignment = models.CharField(max_length=20, choices=COST_CHOICES, null=True, blank=True)
    assigned_dev    = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_tickets')
    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Ticket'
        verbose_name_plural = 'Tickets'
        ordering = ['-created_at']

    def __str__(self):
        return f'[{self.ticket_id}] {self.title}'


class TicketHistory(models.Model):
    ticket      = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='history')
    changed_by  = models.ForeignKey(CustomUser, on_delete=models.PROTECT)
    from_status = models.CharField(max_length=30)
    to_status   = models.CharField(max_length=30)
    comment     = models.TextField(blank=True)
    timestamp   = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Historial del Ticket'
        verbose_name_plural = 'Historial de Tickets'
        ordering = ['timestamp']

    def __str__(self):
        return f'{self.ticket.ticket_id}: {self.from_status} → {self.to_status}'


class TicketAttachment(models.Model):
    ticket      = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='attachments')
    uploaded_by = models.ForeignKey(CustomUser, on_delete=models.PROTECT)
    file        = models.FileField(upload_to='ticket_attachments/%Y/%m/')
    filename    = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.filename} → {self.ticket.ticket_id}'
