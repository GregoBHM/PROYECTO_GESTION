from django.contrib import admin
from .models import Ticket, TicketHistory, TicketAttachment

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ['ticket_id', 'title', 'project', 'requester', 'status', 'priority', 'created_at']
    list_filter = ['status', 'priority', 'request_type', 'project']
    search_fields = ['ticket_id', 'title', 'description']

@admin.register(TicketHistory)
class TicketHistoryAdmin(admin.ModelAdmin):
    list_display = ['ticket', 'changed_by', 'from_status', 'to_status', 'timestamp']
    list_filter = ['to_status']

@admin.register(TicketAttachment)
class TicketAttachmentAdmin(admin.ModelAdmin):
    list_display = ['ticket', 'filename', 'uploaded_by', 'uploaded_at']
