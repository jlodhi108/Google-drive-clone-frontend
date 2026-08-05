import { useCallback, useEffect, useRef, useState } from 'react';
import { Layout } from '../components/Layout';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { PromptDialog } from '../components/PromptDialog';
import { ShareDialog } from '../components/ShareDialog';
import { foldersApi } from '../api/folders';
import { filesApi } from '../api/files';
import { shareApi } from '../api/share';
import { ApiRequestError } from '../api/client';
import { formatBytes, formatDate } from '../utils/format';

export function DrivePage() {
  const [trail, setTrail] = useState([]);
  const [subfolders, setSubfolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [renameTarget, setRenameTarget] = useState(null);
  const [shareTarget, setShareTarget] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const currentFolderId = trail.length > 0 ? trail[trail.length - 1]._id : null;

  const load = useCallback(async (folderId) => {
    setLoading(true);
    setError(null);
    try {
      if (folderId === null) {
        const [folderList, fileList] = await Promise.all([foldersApi.list(null), filesApi.list(null)]);
        setSubfolders(folderList);
        setFiles(fileList);
      } else {
        const data = await foldersApi.getContents(folderId);
        setSubfolders(data.contents.subfolders);
        setFiles(data.contents.files);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(currentFolderId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFolderId]);

  const openFolder = (folder) => setTrail(prev => [...prev, folder]);

  const navigateBreadcrumb = (index) => {
    setTrail(prev => (index === -1 ? [] : prev.slice(0, index + 1)));
  };

  const handleCreateFolder = async (name) => {
    await foldersApi.create(name, currentFolderId);
    await load(currentFolderId);
  };

  const handleRename = async (value) => {
    if (!renameTarget) return;
    if (renameTarget.kind === 'folder') await foldersApi.rename(renameTarget.id, value);
    else await filesApi.rename(renameTarget.id, value);
    await load(currentFolderId);
  };

  const handleDeleteFolder = async (folder) => {
    if (!confirm(`Delete "${folder.name}" and everything inside it?`)) return;
    try {
      await foldersApi.remove(folder._id);
      await load(currentFolderId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete folder');
    }
  };

  const handleDeleteFile = async (file) => {
    if (!confirm(`Delete "${file.name}"?`)) return;
    try {
      await filesApi.remove(file._id);
      await load(currentFolderId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete file');
    }
  };

  const handlePreview = async (file) => {
    try {
      const { downloadUrl } = await filesApi.getDownloadUrl(file._id, 'view');
      window.open(downloadUrl, '_blank');
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Failed to open preview');
    }
  };

  const handleDownload = async (file) => {
    try {
      const { downloadUrl } = await filesApi.getDownloadUrl(file._id, 'download');
      window.open(downloadUrl, '_blank');
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Failed to generate download link');
    }
  };

  const handleShare = async (email, permissions) => {
    if (!shareTarget) return;
    if (shareTarget.kind === 'file') await shareApi.shareFile(shareTarget.id, email, permissions);
    else await shareApi.shareFolder(shareTarget.id, email, permissions);
  };

  const handleFilePicked = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      await filesApi.upload(file, currentFolderId);
      await load(currentFolderId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <Layout>
      <div className="toolbar">
        <Breadcrumbs trail={trail} onNavigate={navigateBreadcrumb} />
        <div className="toolbar-actions">
          <button className="btn-ghost" onClick={() => setShowNewFolder(true)}>New folder</button>
          <button className="btn-primary" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            {uploading ? 'Uploading…' : 'Upload file'}
          </button>
          <input ref={fileInputRef} type="file" hidden onChange={handleFilePicked} />
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      {loading ? (
        <p className="page-loading">Loading…</p>
      ) : subfolders.length === 0 && files.length === 0 ? (
        <p className="empty-state">This folder is empty.</p>
      ) : (
        <table className="item-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Size</th>
              <th>Modified</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {subfolders.map(folder => (
              <tr key={folder._id}>
                <td>
                  <button className="item-name" onClick={() => openFolder(folder)}>
                    <span className="item-icon">📁</span>{folder.name}
                  </button>
                </td>
                <td>—</td>
                <td>{formatDate(folder.updatedAt)}</td>
                <td className="item-actions">
                  <button onClick={() => setShareTarget({ kind: 'folder', id: folder._id, name: folder.name })}>Share</button>
                  <button onClick={() => setRenameTarget({ kind: 'folder', id: folder._id, name: folder.name })}>Rename</button>
                  <button onClick={() => handleDeleteFolder(folder)}>Delete</button>
                </td>
              </tr>
            ))}
            {files.map(file => (
              <tr key={file._id}>
                <td>
                  <button className="item-name" onClick={() => handlePreview(file)}>
                    <span className="item-icon">📄</span>{file.name}
                  </button>
                </td>
                <td>{formatBytes(file.size)}</td>
                <td>{formatDate(file.updatedAt)}</td>
                <td className="item-actions">
                  <button onClick={() => handlePreview(file)}>Preview</button>
                  <button onClick={() => handleDownload(file)}>Download</button>
                  <button onClick={() => setShareTarget({ kind: 'file', id: file._id, name: file.name })}>Share</button>
                  <button onClick={() => setRenameTarget({ kind: 'file', id: file._id, name: file.name })}>Rename</button>
                  <button onClick={() => handleDeleteFile(file)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showNewFolder && (
        <PromptDialog
          title="New folder"
          label="Folder name"
          confirmLabel="Create"
          onSubmit={handleCreateFolder}
          onClose={() => setShowNewFolder(false)}
        />
      )}

      {renameTarget && (
        <PromptDialog
          title={`Rename ${renameTarget.kind}`}
          label="Name"
          initialValue={renameTarget.name}
          confirmLabel="Rename"
          onSubmit={handleRename}
          onClose={() => setRenameTarget(null)}
        />
      )}

      {shareTarget && (
        <ShareDialog
          targetName={shareTarget.name}
          onShare={handleShare}
          onClose={() => setShareTarget(null)}
        />
      )}
    </Layout>
  );
}
