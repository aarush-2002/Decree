// Server route wrapper: opens the filing-packet PDF stream for this case.
import { redirect } from 'next/navigation';

export default async function PacketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/api/cases/${id}/packet`);
}
