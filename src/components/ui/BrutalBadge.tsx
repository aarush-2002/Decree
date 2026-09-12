import React from 'react';
import { cn } from '@/lib/utils';

interface BrutalBadgeProps {
  status: 'filed' | 'noticed' | 'conciliation' | 'decision' | 'execution' | 'closed';
  children?: React.ReactNode;
}

const statusConfig = {
  filed: { bg: 'bg-primary', text: 'text-base', label: 'FILED' },
  noticed: { bg: 'bg-purple-500', text: 'text-white', label: 'NOTICED' },
  conciliation: { bg: 'bg-secondary', text: 'text-base', label: 'CONCILIATION' },
  decision: { bg: 'bg-blue-600', text: 'text-white', label: 'DECISION' },
  execution: { bg: 'bg-destructive', text: 'text-white', label: 'EXECUTION' },
  closed: { bg: 'bg-base', text: 'text-white', label: 'CLOSED' },
};

export const BrutalBadge: React.FC<BrutalBadgeProps> = ({ status, children }) => {
  const config = statusConfig[status];
  return (
    <span className={cn(
      "px-3 py-1 border-[3px] border-black font-mono font-bold text-xs uppercase tracking-wide",
      config.bg, config.text
    )}>
      {children || config.label}
    </span>
  );
};
