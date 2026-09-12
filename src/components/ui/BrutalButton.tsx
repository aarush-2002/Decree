import React from 'react';
import { cn } from '@/lib/utils';

interface BrutalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const BrutalButton: React.FC<BrutalButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children, 
  ...props 
}) => {
  const variants = {
    primary: 'bg-primary text-base hover:bg-primary/90',
    secondary: 'bg-secondary text-base hover:bg-secondary/90',
    outline: 'bg-transparent text-primary border-primary hover:bg-primary hover:text-base',
    destructive: 'bg-destructive text-white hover:bg-destructive/90',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };

  return (
    <button 
      className={cn('brutal-button', variants[variant], sizes[size], className)} 
      {...props}
    >
      {children}
    </button>
  );
};
