import { apiRequest } from './client';
import type { SharedFileEntry, SharedFolderEntry, SharePermission } from '../types';

export const shareApi = {
  shareFile: (fileId: string, email: string, permissions: SharePermission) =>
    apiRequest<{ message: string; sharedFile: SharedFileEntry }>('/share/file', {
      method: 'POST',
      body: { fileId, email, permissions }
    }),

  shareFolder: (folderId: string, email: string, permissions: SharePermission) =>
    apiRequest<{ message: string; sharedFolder: SharedFolderEntry }>('/share/folder', {
      method: 'POST',
      body: { folderId, email, permissions }
    }),

  getSharedFiles: () => apiRequest<SharedFileEntry[]>('/share/files'),

  getSharedFolders: () => apiRequest<SharedFolderEntry[]>('/share/folders'),

  updateFileSharePermissions: (shareId: string, permissions: SharePermission) =>
    apiRequest<{ message: string; sharedFile: SharedFileEntry }>(`/share/file/${shareId}`, {
      method: 'PUT',
      body: { permissions }
    }),

  updateFolderSharePermissions: (shareId: string, permissions: SharePermission) =>
    apiRequest<{ message: string; sharedFolder: SharedFolderEntry }>(`/share/folder/${shareId}`, {
      method: 'PUT',
      body: { permissions }
    }),

  removeFileShare: (shareId: string) =>
    apiRequest<{ message: string }>(`/share/file/${shareId}`, { method: 'DELETE' }),

  removeFolderShare: (shareId: string) =>
    apiRequest<{ message: string }>(`/share/folder/${shareId}`, { method: 'DELETE' })
};
