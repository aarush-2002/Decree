import React from 'react';
import { cn } from '@/lib/utils';

interface BrutalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'amber' | 'teal' | 'error';
}

export const BrutalCard: React.FC<BrutalCardProps> = ({ 
  variant = 'default', 
  className, 
  children, 
  ...props 
}) => {
  const variants = {
    default: 'border-l-[8px] border-l-base',
    amber: 'border-l-[8px] border-l-primary',
    teal: 'border-l-[8px] border-l-secondary',
    error: 'border-l-[8px] border-l-destructive',
  };

  return (
    <div 
      className={cn('brutal-card p-6', variants[variant], className)} 
      {...props}
    >
      {children}
    </div>
  );
};
