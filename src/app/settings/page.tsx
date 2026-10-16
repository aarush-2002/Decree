'use client';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function SettingsPage() {
  return (
    <AppShell>
      <h1 className="font-serif text-4xl text-ink" style={{ fontWeight: 500 }}>Settings</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader eyebrow="Account" title="Profile" />
          <CardBody><p className="text-[15px] text-muted">Manage your name, email and password through the account panel (top right).</p><div className="mt-4"><Button variant="secondary" size="sm">Open account</Button></div></CardBody>
        </Card>
        <Card>
          <CardHeader eyebrow="Data" title="Export & deletion" />
          <CardBody><p className="text-[15px] text-muted">Every case can be exported or deleted with its documents. Deletions complete within 30 days.</p><div className="mt-4"><Button variant="danger" size="sm">Request data deletion</Button></div></CardBody>
        </Card>
      </div>
    </AppShell>
  );
}
