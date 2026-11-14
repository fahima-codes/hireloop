// স্ট্যাটাস পিল — manage jobs টেবিল থেকে রি-ইউজেবল করে বের করা হয়েছে
// এখন job status (Active/Closed) আর application status দুটোই ধরে — প্রতিটার নিজের টোন

import type { ApplicationStatus } from '@/lib/types/applications';
import type { JobStatus } from '@/lib/types/jobs';

type PillStatus = JobStatus | ApplicationStatus;

// প্রতিটা স্ট্যাটাসের রঙ — background/dot/text তিনটাই একই hue-র হালকা ভার্সন
const toneByStatus: Record<PillStatus, string> = {
  // job statuses
  Active: '#22c55e',
  Closed: '#a1a4aa',
  // application statuses — requirements.md-র flow অনুযায়ী
  Applied: '#3b82f6',
  'Under Review': '#f59e0b',
  Shortlisted: '#a855f7',
  Rejected: '#ef4444',
  Offered: '#22c55e',
};

export function StatusPill({ status }: { status: PillStatus }) {
  const tone = toneByStatus[status] ?? '#a1a4aa';
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
      style={{ backgroundColor: `${tone}26`, color: tone }}
    >
      <span
        className="size-1.5 rounded-full"
        style={{ backgroundColor: tone }}
      />
      {status}
    </span>
  );
}
