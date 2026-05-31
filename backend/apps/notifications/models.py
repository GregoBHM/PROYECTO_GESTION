from django.db import models
from apps.users.models import CustomUser
from apps.tickets.models import Ticket


class Notification(models.Model):
    TYPE_CHOICES = [
        ('ticket_created',    'Ticket Creado'),
        ('ticket_approved',   'Ticket Aprobado'),
        ('ticket_rejected',   'Ticket Rechazado'),
        ('ticket_transition', 'Cambio de Estado'),
        ('ticket_assigned',   'Tarea Asignada'),
    ]

    recipient  = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='notifications')
    ticket     = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='notifications', null=True)
    type       = models.CharField(max_length=30, choices=TYPE_CHOICES)
    title      = models.CharField(max_length=300)
    message    = models.TextField()
    is_read    = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Notificación'
        verbose_name_plural = 'Notificaciones'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.title} → {self.recipient.username}'
