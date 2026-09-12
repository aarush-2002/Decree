import React from 'react';
import { cn } from '@/lib/utils';

interface BrutalInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const BrutalInput: React.FC<BrutalInputProps> = ({ label, className, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block font-mono font-bold uppercase mb-2 text-sm">
          {label}
        </label>
      )}
      <input className={cn('brutal-input', className)} {...props} />
    </div>
  );
};
