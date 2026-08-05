import { apiRequest } from './client';
import type { Activity, ActivityListResponse } from '../types';

export const activityApi = {
  list: (page = 1, limit = 20) =>
    apiRequest<ActivityListResponse>(`/activities?page=${page}&limit=${limit}`),

  recent: (limit = 10) => apiRequest<Activity[]>(`/activities/recent?limit=${limit}`),

  unreadCount: () => apiRequest<{ count: number }>('/activities/unread/count'),

  markAsRead: (id: string) => apiRequest<{ message: string; activity: Activity }>(`/activities/${id}/read`, { method: 'POST' })
};
