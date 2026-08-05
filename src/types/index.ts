export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar: string;
  storageUsed: number;
  storageLimit: number;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface AuthResponse {
  message: string;
  token: string;
  refreshToken: string;
  user: AuthUser;
}

export interface Folder {
  _id: string;
  name: string;
  path: string;
  owner: string;
  parent: string | null;
  isRoot: boolean;
  color: string;
  isShared: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DriveFile {
  _id: string;
  name: string;
  originalName: string;
  path: string;
  size: number;
  mimeType: string;
  owner: string;
  folder: string | null;
  isPublic: boolean;
  publicUrl?: string;
  lastAccessed: string;
  isDeleted: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface FolderContents {
  folder: Folder;
  contents: {
    subfolders: Folder[];
    files: DriveFile[];
  };
}

export type ActivityAction =
  | 'upload' | 'download' | 'delete' | 'rename' | 'move'
  | 'share' | 'unshare' | 'create_folder' | 'delete_folder';

export interface Activity {
  _id: string;
  user: string;
  action: ActivityAction;
  target: { _id: string; name?: string } | string | null;
  targetModel: 'File' | 'Folder' | 'SharedFile' | 'SharedFolder';
  status: 'success' | 'failure';
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityListResponse {
  activities: Activity[];
  currentPage: number;
  totalPages: number;
  totalActivities: number;
}

export type SharePermission = 'read' | 'write' | 'admin';

export interface SharedFileEntry {
  _id: string;
  file: DriveFile;
  sharedBy: { _id: string; name: string; email: string };
  permissions: SharePermission;
  isActive: boolean;
  createdAt: string;
}

export interface SharedFolderEntry {
  _id: string;
  folder: Folder;
  sharedBy: { _id: string; name: string; email: string };
  permissions: SharePermission;
  isActive: boolean;
  createdAt: string;
}

export interface ApiError {
  message: string;
  errors?: string[];
}
