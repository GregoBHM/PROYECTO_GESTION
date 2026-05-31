from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    is_admin = models.BooleanField(default=False)
    avatar_url = models.URLField(blank=True, null=True)

    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        ordering = ['username']

    def __str__(self):
        return f'{self.username} ({"Admin" if self.is_admin else "Usuario"})'


class Role(models.Model):
    SOLICITANTE   = 'solicitante'
    DIRECTOR      = 'director'
    GESTOR        = 'gestor_config'
    ANALISTA      = 'analista'
    CCB           = 'ccb'
    DESARROLLADOR = 'desarrollador'
    QA            = 'qa'

    ROLE_CHOICES = [
        (SOLICITANTE,   'Solicitante (Cliente)'),
        (DIRECTOR,      'Director / Jefe de Proyecto'),
        (GESTOR,        'Gestor de Configuración'),
        (ANALISTA,      'Líder Técnico / Analista'),
        (CCB,           'Comité de Control de Cambios (CCB)'),
        (DESARROLLADOR, 'Desarrollador Asignado'),
        (QA,            'Equipo QA / Tester'),
    ]

    name = models.CharField(max_length=50, choices=ROLE_CHOICES, unique=True)

    class Meta:
        verbose_name = 'Rol'
        verbose_name_plural = 'Roles'

    def __str__(self):
        return self.get_name_display()
