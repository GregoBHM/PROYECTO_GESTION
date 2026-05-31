from django.db import models
from apps.projects.models import Project
from apps.users.models import CustomUser


class Activity(models.Model):
    STATUS_CHOICES = [
        ('pendiente',   'Pendiente'),
        ('en_progreso', 'En Progreso'),
        ('completada',  'Completada'),
    ]

    project     = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='activities')
    title       = models.CharField(max_length=300)
    description = models.TextField(blank=True)
    responsible = models.ForeignKey(CustomUser, on_delete=models.PROTECT, related_name='activities')
    deliverable = models.CharField(max_length=200, blank=True)
    start_date  = models.DateField()
    end_date    = models.DateField()
    status      = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pendiente')
    progress    = models.IntegerField(default=0)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Actividad'
        verbose_name_plural = 'Actividades'
        ordering = ['start_date']

    def __str__(self):
        return f'{self.title} ({self.project.name})'
