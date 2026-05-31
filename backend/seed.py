import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings.development')
django.setup()

from django.contrib.auth import get_user_model
from apps.users.models import Role
from apps.projects.models import Project, ProjectMembership
from apps.tickets.models import Ticket, TicketHistory

User = get_user_model()


def run():
    print('Cargando roles...')
    roles = {}
    for name, _ in Role.ROLE_CHOICES:
        role, _ = Role.objects.get_or_create(name=name)
        roles[name] = role

    print('Creando usuario administrador...')
    admin, created = User.objects.get_or_create(
        username='admin',
        defaults={
            'email': 'admin@gestiocambios.com',
            'first_name': 'Administrador',
            'last_name': 'Sistema',
            'is_admin': True,
            'is_staff': True,
            'is_superuser': True,
        }
    )
    if created:
        admin.set_password('Admin2026!')
        admin.save()

    print('Creando usuarios de prueba...')
    users_data = [
        {'username': 'jperez',     'first_name': 'Juan',     'last_name': 'Pérez',      'email': 'jperez@empresa.com'},
        {'username': 'mgarcia',    'first_name': 'María',    'last_name': 'García',      'email': 'mgarcia@empresa.com'},
        {'username': 'crodriguez', 'first_name': 'Carlos',   'last_name': 'Rodríguez',   'email': 'crodriguez@empresa.com'},
        {'username': 'alopez',     'first_name': 'Ana',      'last_name': 'López',       'email': 'alopez@empresa.com'},
        {'username': 'rcastillo',  'first_name': 'Roberto',  'last_name': 'Castillo',    'email': 'rcastillo@empresa.com'},
        {'username': 'lmendoza',   'first_name': 'Laura',    'last_name': 'Mendoza',     'email': 'lmendoza@empresa.com'},
        {'username': 'dfernandez', 'first_name': 'Diego',    'last_name': 'Fernández',   'email': 'dfernandez@empresa.com'},
    ]

    test_users = {}
    for ud in users_data:
        user, created = User.objects.get_or_create(
            username=ud['username'],
            defaults=ud
        )
        if created:
            user.set_password('User2026!')
            user.save()
        test_users[ud['username']] = user

    print('Creando Proyecto 1: Sistema de Facturación...')
    p1, _ = Project.objects.get_or_create(
        name='Sistema de Facturación Electrónica',
        defaults={
            'description': 'Desarrollo e implementación del sistema de facturación electrónica conforme a la normativa SUNAT.',
            'specifications': 'Módulos: Emisión, Recepción, Reportes, Dashboard. Integración con API SUNAT.',
            'methodology': 'RUP',
            'client': test_users['jperez'],
        }
    )

    p1_assignments = [
        ('jperez',     Role.SOLICITANTE),
        ('mgarcia',    Role.DIRECTOR),
        ('crodriguez', Role.GESTOR),
        ('alopez',     Role.ANALISTA),
        ('rcastillo',  Role.CCB),
        ('lmendoza',   Role.DESARROLLADOR),
        ('dfernandez', Role.QA),
    ]
    for username, role_name in p1_assignments:
        ProjectMembership.objects.get_or_create(
            project=p1,
            user=test_users[username],
            defaults={'role': roles[role_name]}
        )

    print('Creando Proyecto 2: Portal de Clientes...')
    p2, _ = Project.objects.get_or_create(
        name='Portal Web de Clientes',
        defaults={
            'description': 'Rediseño del portal web para clientes con acceso a sus pedidos, facturas y soporte.',
            'specifications': 'Stack: React + Django. Módulos: Login, Pedidos, Facturas, Chat de Soporte.',
            'methodology': 'SCRUM',
            'client': test_users['crodriguez'],
        }
    )

    p2_assignments = [
        ('crodriguez', Role.SOLICITANTE),
        ('alopez',     Role.DIRECTOR),
        ('mgarcia',    Role.GESTOR),
        ('dfernandez', Role.ANALISTA),
        ('rcastillo',  Role.CCB),
        ('jperez',     Role.DESARROLLADOR),
        ('lmendoza',   Role.QA),
    ]
    for username, role_name in p2_assignments:
        ProjectMembership.objects.get_or_create(
            project=p2,
            user=test_users[username],
            defaults={'role': roles[role_name]}
        )

    print('Creando tickets de prueba...')
    tickets_data = [
        {
            'project': p1,
            'requester': test_users['jperez'],
            'ticket_id': 'SC-0001',
            'title': 'Error al generar XML de factura con IGV exonerado',
            'description': 'Cuando se emite una factura con productos exonerados de IGV, el XML generado no incluye el tag <cbc:TaxExemptionReasonCode>. Esto causa rechazo por parte de SUNAT con código 2205.',
            'justification': 'Las facturas con exoneración de IGV representan el 15% del volumen de emisión. Sin esta corrección, esos comprobantes deben emitirse manualmente.',
            'request_type': 'bug',
            'priority': 'critica',
            'status': 'en_desarrollo',
        },
        {
            'project': p1,
            'requester': test_users['jperez'],
            'ticket_id': 'SC-0002',
            'title': 'Agregar dashboard de métricas de facturación',
            'description': 'Se requiere un dashboard que muestre: total facturado por mes, cantidad de comprobantes emitidos, tasa de rechazo SUNAT y gráficos de tendencia.',
            'justification': 'El área contable necesita visibilidad en tiempo real del estado de facturación para tomar decisiones de negocio.',
            'request_type': 'feature',
            'priority': 'alta',
            'status': 'pendiente_ccb',
        },
        {
            'project': p1,
            'requester': test_users['jperez'],
            'ticket_id': 'SC-0003',
            'title': 'Mejorar rendimiento de consulta de comprobantes',
            'description': 'La pantalla de listado de comprobantes tarda más de 8 segundos en cargar cuando hay más de 10,000 registros. Se necesita paginación del lado del servidor y cacheo.',
            'justification': 'Los usuarios reportan frustración con los tiempos de carga. Impacta la productividad del área de facturación.',
            'request_type': 'mejora',
            'priority': 'media',
            'status': 'en_analisis',
        },
        {
            'project': p1,
            'requester': test_users['jperez'],
            'ticket_id': 'SC-0004',
            'title': 'Soporte para notas de crédito electrónicas',
            'description': 'Implementar la emisión de notas de crédito electrónicas asociadas a facturas existentes, con validación de motivo y referencia al comprobante original.',
            'justification': 'Actualmente las notas de crédito se procesan manualmente. Se estima un ahorro de 20 horas/mes al automatizar este proceso.',
            'request_type': 'feature',
            'priority': 'alta',
            'status': 'pendiente_evaluacion',
        },
        {
            'project': p2,
            'requester': test_users['crodriguez'],
            'ticket_id': 'SC-0005',
            'title': 'Login social con Google y Microsoft',
            'description': 'Implementar autenticación SSO con Google Workspace y Microsoft 365 para que los clientes corporativos puedan acceder con sus cuentas empresariales.',
            'justification': 'El 70% de nuestros clientes corporativos usan Google o Microsoft. Reducirá la fricción de registro y mejorará la adopción del portal.',
            'request_type': 'feature',
            'priority': 'alta',
            'status': 'en_qa',
        },
        {
            'project': p2,
            'requester': test_users['crodriguez'],
            'ticket_id': 'SC-0006',
            'title': 'Error 500 al descargar factura en formato PDF',
            'description': 'Al hacer click en "Descargar PDF" en facturas con más de 50 líneas de detalle, el servidor retorna un error 500. El log muestra un timeout en la generación del PDF.',
            'justification': 'Afecta a clientes con pedidos grandes. Se han recibido 12 tickets de soporte esta semana por este problema.',
            'request_type': 'bug',
            'priority': 'critica',
            'status': 'en_desarrollo',
        },
    ]

    for td in tickets_data:
        ticket, created = Ticket.objects.get_or_create(
            ticket_id=td['ticket_id'],
            defaults=td
        )
        if created:
            TicketHistory.objects.create(
                ticket=ticket,
                changed_by=td['requester'],
                from_status='',
                to_status='pendiente_evaluacion',
                comment='Solicitud registrada en el sistema'
            )
            if td['status'] != 'pendiente_evaluacion':
                TicketHistory.objects.create(
                    ticket=ticket,
                    changed_by=test_users['mgarcia'] if td['project'] == p1 else test_users['alopez'],
                    from_status='pendiente_evaluacion',
                    to_status=td['status'],
                    comment='Solicitud evaluada y aprobada'
                )

    print('')
    print('=' * 60)
    print('DATOS DE DEMOSTRACIÓN CARGADOS EXITOSAMENTE')
    print('=' * 60)
    print('')
    print('CREDENCIALES:')
    print('  Admin:     admin / Admin2026!')
    print('  Usuarios:  jperez, mgarcia, crodriguez, alopez,')
    print('             rcastillo, lmendoza, dfernandez / User2026!')
    print('')
    print('PROYECTOS:')
    print(f'  1. {p1.name} (RUP)')
    print(f'  2. {p2.name} (SCRUM)')
    print('')
    print(f'TICKETS: {Ticket.objects.count()} registrados')
    print('=' * 60)


if __name__ == '__main__':
    run()
