import axiosClient from './axiosClient'

export const authApi = {
  login: (username: string, password: string) =>
    axiosClient.post('/auth/login/', { username, password }),

  refresh: (refresh: string) =>
    axiosClient.post('/auth/refresh/', { refresh }),

  logout: (refresh: string) =>
    axiosClient.post('/auth/logout/', { refresh }),

  me: () =>
    axiosClient.get('/auth/me/'),

  register: (data: { username: string; email: string; first_name: string; last_name: string; password: string; password_confirm: string }) =>
    axiosClient.post('/auth/register/', data),

  listUsers: () =>
    axiosClient.get('/auth/users/'),
}
