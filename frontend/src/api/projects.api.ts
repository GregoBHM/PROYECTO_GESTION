import axiosClient from './axiosClient'

export const projectsApi = {
  getMyProjects: () =>
    axiosClient.get('/projects/mine/'),

  getAll: () =>
    axiosClient.get('/projects/'),

  getById: (id: number) =>
    axiosClient.get(`/projects/${id}/`),

  create: (data: { name: string; description: string; specifications?: string; methodology: string; client_id: number }) =>
    axiosClient.post('/projects/', data),

  update: (id: number, data: any) =>
    axiosClient.patch(`/projects/${id}/`, data),

  addMember: (projectId: number, data: { user_id: number; role_id: number }) =>
    axiosClient.post(`/projects/${projectId}/members/`, data),

  removeMember: (projectId: number, membershipId: number) =>
    axiosClient.delete(`/projects/${projectId}/members/${membershipId}/`),
}
