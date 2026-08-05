import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { shareApi } from '../api/share';
import { filesApi } from '../api/files';
import { formatBytes, formatDate } from '../utils/format';

export function SharedPage() {
  const [sharedFiles, setSharedFiles] = useState([]);
  const [sharedFolders, setSharedFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([shareApi.getSharedFiles(), shareApi.getSharedFolders()])
      .then(([sFiles, sFolders]) => {
        setSharedFiles(sFiles);
        setSharedFolders(sFolders);
      })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load shared items'))
      .finally(() => setLoading(false));
  }, []);

  const handlePreview = async (fileId) => {
    try {
      const { downloadUrl } = await filesApi.getDownloadUrl(fileId, 'view');
      window.open(downloadUrl, '_blank');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to open preview');
    }
  };

  const handleDownload = async (fileId) => {
    try {
      const { downloadUrl } = await filesApi.getDownloadUrl(fileId, 'download');
      window.open(downloadUrl, '_blank');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate download link');
    }
  };

  return (
    <Layout>
      <h2>Shared with me</h2>
      {error && <p className="form-error">{error}</p>}
      {loading ? (
        <p className="page-loading">Loading…</p>
      ) : sharedFiles.length === 0 && sharedFolders.length === 0 ? (
        <p className="empty-state">Nothing has been shared with you yet.</p>
      ) : (
        <table className="item-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Shared by</th>
              <th>Permission</th>
              <th>Size</th>
              <th>Shared on</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sharedFolders.map(entry => (
              <tr key={entry._id}>
                <td><span className="item-name"><span className="item-icon">📁</span>{entry.folder?.name}</span></td>
                <td>{entry.sharedBy?.name} ({entry.sharedBy?.email})</td>
                <td><span className="permission-badge">{entry.permissions}</span></td>
                <td>—</td>
                <td>{formatDate(entry.createdAt)}</td>
                <td></td>
              </tr>
            ))}
            {sharedFiles.map(entry => (
              <tr key={entry._id}>
                <td>
                  <button className="item-name" onClick={() => handlePreview(entry.file._id)}>
                    <span className="item-icon">📄</span>{entry.file?.name}
                  </button>
                </td>
                <td>{entry.sharedBy?.name} ({entry.sharedBy?.email})</td>
                <td><span className="permission-badge">{entry.permissions}</span></td>
                <td>{entry.file ? formatBytes(entry.file.size) : '—'}</td>
                <td>{formatDate(entry.createdAt)}</td>
                <td className="item-actions">
                  <button onClick={() => handlePreview(entry.file._id)}>Preview</button>
                  <button onClick={() => handleDownload(entry.file._id)}>Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}
