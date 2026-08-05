import { apiRequest } from './client';
import type { DriveFile } from '../types';

export const filesApi = {
  list: (folderId?: string | null) =>
    apiRequest<DriveFile[]>(`/files${folderId ? `?folderId=${folderId}` : ''}`),

  search: (query: string) =>
    apiRequest<DriveFile[]>(`/files/search?query=${encodeURIComponent(query)}`),

  get: (id: string) => apiRequest<DriveFile>(`/files/${id}`),

  upload: (file: File, folderId?: string | null) => {
    const formData = new FormData();
    formData.append('file', file);
    if (folderId) formData.append('folderId', folderId);
    return apiRequest<{ message: string; file: { id: string; name: string; path: string; size: number; mimeType: string } }>(
      '/files/upload',
      { method: 'POST', body: formData, isFormData: true }
    );
  },

  rename: (id: string, name: string) =>
    apiRequest<{ message: string; file: DriveFile }>(`/files/${id}`, { method: 'PUT', body: { name } }),

  remove: (id: string) => apiRequest<{ message: string }>(`/files/${id}`, { method: 'DELETE' }),

  getDownloadUrl: (id: string, mode: 'view' | 'download' = 'download') =>
    apiRequest<{ downloadUrl: string }>(`/files/${id}/download?mode=${mode}`)
};
