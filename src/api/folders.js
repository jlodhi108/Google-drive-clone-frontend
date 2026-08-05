import { apiRequest } from './client';

export const foldersApi = {
  list: (parentId) =>
    apiRequest(`/folders${parentId ? `?parentId=${parentId}` : ''}`),

  search: (query) =>
    apiRequest(`/folders/search?query=${encodeURIComponent(query)}`),

  get: (id) => apiRequest(`/folders/${id}`),

  getContents: (id) => apiRequest(`/folders/${id}/contents`),

  create: (name, parentId) =>
    apiRequest('/folders', {
      method: 'POST',
      body: { name, parentId: parentId ?? undefined }
    }),

  rename: (id, name) =>
    apiRequest(`/folders/${id}`, { method: 'PUT', body: { name } }),

  remove: (id) => apiRequest(`/folders/${id}`, { method: 'DELETE' })
};
