from django.db import models
from apps.users.models import CustomUser, Role


class Project(models.Model):
    METHODOLOGY_CHOICES = [
        ('RUP',    'Proceso Unificado de Rational (RUP)'),
        ('SCRUM',  'Scrum'),
        ('KANBAN', 'Kanban'),
    ]

    name           = models.CharField(max_length=200)
    description    = models.TextField()
    specifications = models.TextField(blank=True)
    methodology    = models.CharField(max_length=20, choices=METHODOLOGY_CHOICES, default='RUP')
    client         = models.ForeignKey(CustomUser, on_delete=models.PROTECT, related_name='owned_projects')
    is_active      = models.BooleanField(default=True)
    created_at     = models.DateTimeField(auto_now_add=True)
    updated_at     = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Proyecto'
        verbose_name_plural = 'Proyectos'
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    @property
    def ticket_count(self):
        return self.tickets.count()

    @property
    def open_ticket_count(self):
        return self.tickets.exclude(status='cerrado').count()


class ProjectMembership(models.Model):
    project   = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='memberships')
    user      = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='project_memberships')
    role      = models.ForeignKey(Role, on_delete=models.PROTECT, related_name='memberships')
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Asignación de Proyecto'
        verbose_name_plural = 'Asignaciones de Proyecto'
        unique_together = ('project', 'user')

    def __str__(self):
        return f'{self.user.username} → {self.role.get_name_display()} en "{self.project.name}"'
