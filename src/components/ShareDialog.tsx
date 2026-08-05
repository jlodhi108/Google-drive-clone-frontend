import { useState } from 'react';
import type { FormEvent } from 'react';
import type { SharePermission } from '../types';

interface ShareDialogProps {
  targetName: string;
  onShare: (email: string, permissions: SharePermission) => Promise<void>;
  onClose: () => void;
}

export function ShareDialog({ targetName, onShare, onClose }: ShareDialogProps) {
  const [email, setEmail] = useState('');
  const [permissions, setPermissions] = useState<SharePermission>('read');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await onShare(email, permissions);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to share');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>Share "{targetName}"</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="person@example.com" />
          </label>
          <label>
            Permission
            <select value={permissions} onChange={e => setPermissions(e.target.value as SharePermission)}>
              <option value="read">Read</option>
              <option value="write">Write</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          {error && <p className="form-error">{error}</p>}
          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Sharing…' : 'Share'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
