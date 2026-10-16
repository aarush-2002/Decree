'use client';
import { useCallback, useRef, useState } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const MAX_MB = 4;
const ACCEPT = ['application/pdf', 'image/jpeg', 'image/png'];
const EXT = /\.(pdf|jpe?g|png)$/i;

export interface AcceptedFile { file: File; name: string; sizeKB: number }

/**
 * Invoice dropzone with drag-over state, inline validation errors and a
 * calm "breathing" hover. Reassurance copy is part of the component —
 * every upload surface should say it.
 */
export function Dropzone({
  onFiles,
  disabled,
}: {
  onFiles: (files: AcceptedFile[]) => void;
  disabled?: boolean;
}) {
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = useCallback((list: FileList | File[]): AcceptedFile[] | null => {
    const files = Array.from(list);
    if (!files.length) return null;
    const out: AcceptedFile[] = [];
    for (const f of files) {
      if (!ACCEPT.includes(f.type) && !EXT.test(f.name)) {
        setError(`“${f.name}” isn’t supported. Use PDF, JPG or PNG.`);
        return null;
      }
      if (f.size > MAX_MB * 1024 * 1024) {
        setError(`“${f.name}” is larger than ${MAX_MB}MB. Compress it or send a photo of the invoice page only.`);
        return null;
      }
      out.push({ file: f, name: f.name, sizeKB: Math.round(f.size / 1024) });
    }
    setError(null);
    return out;
  }, []);

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-disabled={disabled}
        aria-label="Upload invoice — press Enter to browse files"
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          if (disabled) return;
          const ok = validate(e.dataTransfer.files);
          if (ok) onFiles(ok);
        }}
        className={cn(
          'group relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center gap-3 rounded-card border-2 border-dashed px-6 py-12 text-center transition-all duration-200 ease-out',
          drag
            ? 'scale-[1.01] border-brass bg-brass-soft/50'
            : 'border-line-strong bg-canvas hover:border-primary/50 hover:bg-primary-soft/30',
          disabled && 'pointer-events-none opacity-50',
        )}
      >
        <span
          className={cn(
            'grid h-14 w-14 place-items-center rounded-full border border-line-strong bg-surface text-primary transition-transform duration-300 ease-out',
            !disabled && 'group-hover:animate-[breathe_2.4s_ease-in-out_infinite]',
          )}
          style={{ animationName: 'breathe' }}
        >
          <style>{`@keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}`}</style>
          <UploadCloud size={24} strokeWidth={1.5} />
        </span>
        <p className="text-[17px] font-medium text-ink">
          Drop your invoice here, <span className="text-brass">or click to browse</span>
        </p>
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-faint">
          Supports PDF, JPG, PNG · Max {MAX_MB}MB
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          className="sr-only"
          onChange={(e) => {
            const ok = validate(e.target.files ?? []);
            if (ok) onFiles(ok);
            e.target.value = '';
          }}
        />
      </div>

      {error && (
        <div role="alert" className="mt-3 flex items-start gap-2 rounded-control border border-danger/30 bg-danger-bg px-4 py-3 text-sm text-danger">
          <X size={16} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      <p className="mt-4 flex items-center justify-center gap-2 text-sm text-muted">
        <FileText size={14} strokeWidth={1.5} className="text-primary" />
        Your documents are encrypted and only visible to you.
      </p>
    </div>
  );
}
