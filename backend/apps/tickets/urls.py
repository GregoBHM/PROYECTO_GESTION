from django.urls import path
from .views import (
    TicketListView,
    TicketCreateView,
    TicketDetailView,
    TicketTransitionView,
    TicketAvailableTransitionsView,
    TicketHistoryView,
)

urlpatterns = [
    path('',                          TicketListView.as_view(),                name='ticket-list'),
    path('create/',                   TicketCreateView.as_view(),              name='ticket-create'),
    path('<int:pk>/',                 TicketDetailView.as_view(),              name='ticket-detail'),
    path('<int:pk>/transition/',      TicketTransitionView.as_view(),          name='ticket-transition'),
    path('<int:pk>/transitions/',     TicketAvailableTransitionsView.as_view(), name='ticket-transitions'),
    path('<int:pk>/history/',         TicketHistoryView.as_view(),             name='ticket-history'),
]
