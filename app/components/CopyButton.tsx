'use client';

import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';

// receipt-এর transaction ID ইত্যাদি copy করার ছোট client button —
// clipboard API browser-only, তাই server component থেকে সরাসরি চলে না
const CopyButton = ({ value }: { value: string }) => {
  const [copied, setCopied] = useState(false);

  // copy সফল হলে ২ সেকেন্ড পরে আবার copy icon-এ ফিরে যাই
  useEffect(() => {
    if (!copied) return;

    const timeout = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      // clipboard ব্লক থাকলে চুপচাপ fail করি — user নিজের হাতে select করতে পারবে
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? 'Copied' : 'Copy'}
      className="inline-flex size-7 items-center justify-center rounded-md text-[#6e6e78] transition-colors hover:bg-white/5 hover:text-white"
    >
      {copied ? (
        <Check className="size-3.5 text-emerald-400" aria-hidden />
      ) : (
        <Copy className="size-3.5" aria-hidden />
      )}
    </button>
  );
};

export default CopyButton;
