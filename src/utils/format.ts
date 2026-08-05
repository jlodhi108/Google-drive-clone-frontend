export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

export function describeActivity(action: string): string {
  const labels: Record<string, string> = {
    upload: 'uploaded',
    download: 'downloaded',
    delete: 'deleted',
    rename: 'renamed',
    move: 'moved',
    share: 'shared',
    unshare: 'unshared',
    create_folder: 'created folder',
    delete_folder: 'deleted folder'
  };
  return labels[action] ?? action;
}
