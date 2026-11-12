// স্ট্যাটাস পিল — Active সবুজ (#22c55e), Closed ধূসর
// manage jobs টেবিল থেকে রি-ইউজেবল করে বের করা হয়েছে

import type { JobStatus } from '@/lib/types/jobs';

export function StatusPill({ status }: { status: JobStatus }) {
  const active = status === 'Active';
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
        active
          ? 'bg-[#22c55e]/15 text-[#22c55e]'
          : 'bg-[#a1a4aa]/15 text-[#a0a0ab]'
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${
          active ? 'bg-[#22c55e]' : 'bg-[#a1a4aa]'
        }`}
      />
      {status}
    </span>
  );
}
