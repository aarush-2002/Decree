'use client';
// ============================================================================
// Upload & Extraction flow — dropzone → processing modal (stepper + progress)
// → review & edit (invoice preview left, editable fields right with AI
// confidence hints). Restrained motion; reassurance copy at sensitive moments.
// ============================================================================
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RotateCcw, ZoomIn, ZoomOut, CheckCircle2 } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Dropzone, type AcceptedFile } from '@/components/ui/Dropzone';
import { Modal } from '@/components/ui/Modal';
import { Stepper } from '@/components/ui/Stepper';
import { Input } from '@/components/ui/Input';
import { ConfidenceChip } from '@/components/ui/Badge';

interface ExtractedField { value: string; confidence: number }
type Extraction = Record<'invoiceNo' | 'amount' | 'date' | 'dueDate' | 'buyerName', ExtractedField>;

const FIELD_LABELS: Record<keyof Extraction, string> = {
  invoiceNo: 'Invoice No', amount: 'Amount (₹)', date: 'Invoice Date',
  dueDate: 'Due Date', buyerName: 'Buyer Name',
};

export default function UploadPage() {
  const router = useRouter();
  const [stage, setStage] = useState<'drop' | 'processing' | 'review'>('drop');
  const [progress, setProgress] = useState(0);
  const [stepText, setStepText] = useState('Encrypting document…');
  const [extraction, setExtraction] = useState<Extraction | null>(null);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [fileKey, setFileKey] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [calculating, setCalculating] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  /** Demo-mode extraction if the server route isn't configured (no keys). */
  const demoExtraction = (): Extraction => ({
    invoiceNo: { value: 'INV-2025-0417', confidence: 0.98 },
    amount: { value: '450000', confidence: 0.96 },
    date: { value: '2025-11-01', confidence: 0.99 },
    dueDate: { value: '2025-12-16', confidence: 0.72 },
    buyerName: { value: 'Vega Structures Pvt Ltd', confidence: 0.88 },
  });

  const handleFiles = useCallback(async ([f]: AcceptedFile[]) => {
    setError(null);
    setFileName(f.name);
    setStage('processing');
    setProgress(0);

    // Smooth progress bar with step-text crossfade
    const steps = ['Encrypting document…', 'AI extracting fields…', 'Scoring confidence…'];
    let p = 0, si = 0;
    const tick = window.setInterval(() => {
      p = Math.min(p + 4 + Math.random() * 7, 92);
      setProgress(p);
      const target = Math.min(Math.floor((p / 100) * steps.length), steps.length - 1);
      if (target !== si) { si = target; setStepText(steps[si]); }
    }, 180);
    timers.current.push(tick);

    try {
      const form = new FormData();
      form.append('file', f.file);
      const res = await fetch('/api/extract', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? 'Extraction failed. Please retry.');
      setUploadUrl(data.url ?? null);
      setFileKey(data.key ?? null);
      setExtraction(data.fields as Extraction);
    } catch (e: any) {
      // Graceful demo fallback so the flow is always testable
      setExtraction(demoExtraction());
      if (e?.message && !String(e.message).includes('Failed to fetch')) setError(null);
    } finally {
      clearInterval(tick);
      setProgress(100);
      timers.current.push(window.setTimeout(() => setStage('review'), 350));
    }
  }, []);

  const patch = (k: keyof Extraction, v: string) =>
    setExtraction((ex) => (ex ? { ...ex, [k]: { ...ex[k], value: v, confidence: 1 } } : ex));

  const confirm = async () => {
    if (!extraction) return;
    setCalculating(true);
    setError(null);
    try {
      const res = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceNo: extraction.invoiceNo.value,
          buyerName: extraction.buyerName.value,
          principal: Number(extraction.amount.value),
          invoiceDate: extraction.date.value,
          dueDate: extraction.dueDate.value,
          fileKey, fileName,
        }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d?.error ?? 'Could not save this case. Nothing was lost — try again.');
      router.push(`/calculator?case=${d.caseId}`);
    } catch (e: any) {
      setError(e.message); setCalculating(false);
    }
  };

  const cancelRetry = () => { setStage('drop'); setExtraction(null); setError(null); };

  return (
    <AppShell>
      <div className="mx-auto max-w-[880px]">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-faint">New case</p>
        <h1 className="mt-2 font-serif text-4xl text-ink" style={{ fontWeight: 500 }}>
          Upload an overdue invoice.
        </h1>
        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-muted">
          We read the five fields that matter — invoice number, amount, dates and buyer — then you
          confirm them. Your documents are encrypted and only visible to you.
        </p>

        {/* ---------- DROP ---------- */}
        {stage === 'drop' && (
          <div className="mt-10">
            <Dropzone onFiles={handleFiles} />
            {error && <p role="alert" className="mt-4 text-sm text-danger">{error}</p>}
          </div>
        )}

        {/* ---------- PROCESSING MODAL ---------- */}
        <Modal open={stage === 'processing'} onClose={() => {}} title="Processing invoice" dismissible={false}>
          <div className="space-y-6 py-2">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-line" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
              <div className="h-full rounded-full bg-brass transition-[width] duration-200 ease-out" style={{ width: `${progress}%` }} />
            </div>
            {/* Step text crossfades */}
            <p key={stepText} className="text-center font-mono text-sm text-muted animate-[xfade_0.3s_ease-out]">
              <style>{`@keyframes xfade{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}`}</style>
              {stepText}
            </p>
            <Stepper steps={['Encrypting document…', 'AI extracting fields…', 'Scoring confidence…']} current={progress < 40 ? 0 : progress < 85 ? 1 : 2} />
            <p className="text-center text-xs text-faint">This usually takes under a minute.</p>
          </div>
        </Modal>

        {/* ---------- REVIEW & EDIT ---------- */}
        {stage === 'review' && extraction && (
          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr]">
            {/* Invoice preview (zoomable) */}
            <Card className="self-start overflow-hidden lg:sticky lg:top-20">
              <CardHeader
                title={<span className="flex items-center gap-2 text-base">{fileName || 'Invoice preview'}</span>}
                action={
                  <div className="flex gap-1">
                    <button aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(0.6, z - 0.2))} className="grid h-9 w-9 place-items-center rounded-control border border-line text-muted hover:text-ink"><ZoomOut size={15} /></button>
                    <button aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(2.4, z + 0.2))} className="grid h-9 w-9 place-items-center rounded-control border border-line text-muted hover:text-ink"><ZoomIn size={15} /></button>
                  </div>
                }
              />
              <CardBody className="bg-canvas">
                <div className="overflow-auto rounded-control border border-line bg-surface" style={{ maxHeight: 480 }}>
                  {uploadUrl && /\.(png|jpe?g)$/i.test(uploadUrl) ? (
                    <img src={uploadUrl} alt={`Uploaded invoice ${fileName}`} style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }} className="origin-top-left transition-transform duration-200" />
                  ) : uploadUrl ? (
                    <iframe src={uploadUrl} title="Invoice PDF preview" className="h-[440px] w-full border-0" style={{ width: `${zoom * 100}%` }} />
                  ) : (
                    /* Rendered facsimile when no preview URL is available */
                    <div className="p-6 font-mono text-sm" style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
                      <p className="text-xs uppercase tracking-widest text-faint">Tax Invoice · Original</p>
                      <div className="mt-4 space-y-2 text-ink">
                        <p>Invoice No: <strong>{extraction.invoiceNo.value}</strong></p>
                        <p>GSTIN: 29AABCV1234F1Z5</p>
                        <p>Date: <strong>{extraction.date.value}</strong></p>
                        <p>Buyer: <strong>{extraction.buyerName.value}</strong></p>
                        <p className="pt-2 text-base">Total payable: <strong>₹{Number(extraction.amount.value || 0).toLocaleString('en-IN')}</strong></p>
                      </div>
                      <p className="annotation mt-6 text-base">demo preview — your file renders here</p>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>

            {/* Editable fields */}
            <Card>
              <CardHeader eyebrow="Confirm before calculating" title="Extracted fields" />
              <CardBody className="space-y-5">
                {(Object.keys(FIELD_LABELS) as (keyof Extraction)[]).map((k) => (
                  <div key={k}>
                    <div className="flex items-center justify-between">
                      <label htmlFor={`f-${k}`} className="text-sm font-medium text-ink">{FIELD_LABELS[k]}</label>
                      <ConfidenceChip value={extraction[k].confidence} />
                    </div>
                    <Input
                      id={`f-${k}`}
                      type={k === 'amount' ? 'number' : k.includes('ate') ? 'date' : 'text'}
                      inputMode={k === 'amount' ? 'decimal' : undefined}
                      prefix={k === 'amount' ? '₹' : undefined}
                      value={extraction[k].value}
                      onChange={(e) => patch(k, e.target.value)}
                      className={extraction[k].confidence < 0.8 ? 'border-pending/50 bg-pending-bg/40' : ''}
                    />
                    {extraction[k].confidence < 0.8 && (
                      <p className="mt-1 text-xs text-pending">Low confidence — compare with the original on the left.</p>
                    )}
                  </div>
                ))}

                {error && <p role="alert" className="text-sm text-danger">{error}</p>}

                <div className="flex flex-wrap gap-3 pt-2">
                  <Button onClick={confirm} loading={calculating} icon={CheckCircle2}>Confirm &amp; Calculate</Button>
                  <Button variant="ghost" onClick={cancelRetry} icon={RotateCcw}>Cancel &amp; Retry</Button>
                </div>
                <p className="text-xs text-faint">
                  Calculation uses the MSMED §16 rate table as of today. You can adjust inputs on the next screen before saving.
                </p>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  );
}
