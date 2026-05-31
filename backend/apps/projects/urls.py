from django.urls import path
from .views import (
    ProjectListCreateView,
    ProjectDetailView,
    ProjectMemberCreateView,
    ProjectMemberDeleteView,
    MyProjectsView,
)

urlpatterns = [
    path('',                             ProjectListCreateView.as_view(),  name='project-list-create'),
    path('mine/',                        MyProjectsView.as_view(),         name='my-projects'),
    path('<int:pk>/',                    ProjectDetailView.as_view(),      name='project-detail'),
    path('<int:pk>/members/',            ProjectMemberCreateView.as_view(), name='project-member-create'),
    path('<int:pk>/members/<int:membership_id>/', ProjectMemberDeleteView.as_view(), name='project-member-delete'),
]
