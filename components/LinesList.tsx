'use client';

import { Line } from '@/types';
import LineItem from './LineItem';

interface LinesListProps {
  lines: Line[];
  onRegenerate: (lineId: string) => void;
  onDelete: (lineId: string) => void;
  onLineUpdate: (lineId: string, newText: string) => void;
}

export default function LinesList({ lines, onRegenerate, onDelete, onLineUpdate }: LinesListProps) {
  if (lines.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Lines header */}
      <div className="flex items-center justify-between px-1">
        <span className="text-sm font-medium text-muted-foreground">
          {lines.length} {lines.length === 1 ? 'line' : 'lines'} loaded
        </span>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Ready: {lines.filter(l => l.status === 'ready' || l.status === 'stale').length}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Processing: {lines.filter(l => l.status === 'processing').length}
          </span>
        </div>
      </div>

      {/* Lines list */}
      <div className="space-y-2">
        {lines.map((line, index) => (
          <LineItem
            key={line.id}
            line={line}
            index={index}
            onRegenerate={onRegenerate}
            onDelete={onDelete}
            onLineUpdate={onLineUpdate}
            onPlay={() => {
              // Play functionality is handled inside LineItem component
            }}
          />
        ))}
      </div>
    </div>
  );
}
