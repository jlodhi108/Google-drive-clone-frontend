import { useState } from 'react';
import type { FormEvent } from 'react';

interface PromptDialogProps {
  title: string;
  label: string;
  initialValue?: string;
  confirmLabel?: string;
  onSubmit: (value: string) => Promise<void>;
  onClose: () => void;
}

export function PromptDialog({ title, label, initialValue = '', confirmLabel = 'Save', onSubmit, onClose }: PromptDialogProps) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit(value.trim());
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>{title}</h3>
        <form onSubmit={handleSubmit}>
          <label>
            {label}
            {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
            <input autoFocus value={value} onChange={e => setValue(e.target.value)} />
          </label>
          {error && <p className="form-error">{error}</p>}
          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Saving…' : confirmLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
