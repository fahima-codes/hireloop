// তারিখ-সংক্রান্ত শেয়ার্ড হেল্পার — seeker/applications আর recruiter-এর applications
// পেজ দুটোই ব্যবহার করে (আগে seeker পেজে inline ছিল — ডুপ্লিকেশন এড়াতে এক জায়গায় আনা হলো)

// Date Applied — relative format ("5 days ago", requirements.md অনুযায়ী)
const rtf = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' });

export function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  // invalid/missing date → NaN — RelativeTimeFormat crash করে, তাই আগেই ধরে নিই
  if (!Number.isFinite(diffMs)) return '—';
  const minutes = Math.round(diffMs / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return rtf.format(-minutes, 'minute');
  const hours = Math.round(minutes / 60);
  if (hours < 24) return rtf.format(-hours, 'hour');
  const days = Math.round(hours / 24);
  if (days < 30) return rtf.format(-days, 'day');
  return rtf.format(-Math.round(days / 30), 'month');
}
