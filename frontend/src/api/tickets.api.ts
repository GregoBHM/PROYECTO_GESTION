import axiosClient from './axiosClient'

export const ticketsApi = {
  getAll: (projectId?: number) => {
    const params = projectId ? { project_id: projectId } : {}
    return axiosClient.get('/tickets/', { params })
  },

  getById: (id: number) =>
    axiosClient.get(`/tickets/${id}/`),

  create: (data: { project_id: number; title: string; description: string; justification: string; request_type: string; priority: string }) =>
    axiosClient.post('/tickets/create/', data),

  transition: (id: number, data: { to_status: string; comment?: string }) =>
    axiosClient.patch(`/tickets/${id}/transition/`, data),

  getTransitions: (id: number) =>
    axiosClient.get(`/tickets/${id}/transitions/`),

  getHistory: (id: number) =>
    axiosClient.get(`/tickets/${id}/history/`),
}
