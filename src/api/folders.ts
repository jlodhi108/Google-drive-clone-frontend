import { apiRequest } from './client';
import type { Folder, FolderContents } from '../types';

export const foldersApi = {
  list: (parentId?: string | null) =>
    apiRequest<Folder[]>(`/folders${parentId ? `?parentId=${parentId}` : ''}`),

  search: (query: string) =>
    apiRequest<Folder[]>(`/folders/search?query=${encodeURIComponent(query)}`),

  get: (id: string) => apiRequest<Folder>(`/folders/${id}`),

  getContents: (id: string) => apiRequest<FolderContents>(`/folders/${id}/contents`),

  create: (name: string, parentId?: string | null) =>
    apiRequest<{ message: string; folder: Folder }>('/folders', {
      method: 'POST',
      body: { name, parentId: parentId ?? undefined }
    }),

  rename: (id: string, name: string) =>
    apiRequest<{ message: string; folder: Folder }>(`/folders/${id}`, { method: 'PUT', body: { name } }),

  remove: (id: string) => apiRequest<{ message: string }>(`/folders/${id}`, { method: 'DELETE' })
};
