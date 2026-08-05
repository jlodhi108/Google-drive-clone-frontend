import type { Folder } from '../types';

interface BreadcrumbsProps {
  trail: Folder[];
  onNavigate: (index: number) => void;
}

// index -1 means "My Drive" (root)
export function Breadcrumbs({ trail, onNavigate }: BreadcrumbsProps) {
  return (
    <div className="breadcrumbs">
      <button className="crumb" onClick={() => onNavigate(-1)}>My Drive</button>
      {trail.map((folder, index) => (
        <span key={folder._id}>
          <span className="crumb-sep">/</span>
          <button className="crumb" onClick={() => onNavigate(index)}>{folder.name}</button>
        </span>
      ))}
    </div>
  );
}
