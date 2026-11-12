// আইকন অ্যাকশন বাটন — টেবিলের View/Edit/Delete রো অ্যাকশনে ব্যবহৃত
// manage jobs পেজ থেকে রি-ইউজেবল করে বের করা হয়েছে

import type { ReactNode } from 'react';

type IconButtonProps = {
  /** aria-label — স্ক্রিন রিডারের জন্য */
  label: string;
  /** হোভার tooltip — না দিলে label-ই ব্যবহার হয় */
  title?: string;
  icon: ReactNode;
  variant?: 'default' | 'danger';
} & Omit<React.ComponentProps<'button'>, 'children' | 'title' | 'aria-label'>;

export function IconButton({
  label,
  title,
  icon,
  variant = 'default',
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={title ?? label}
      className={`flex size-8 items-center justify-center rounded-lg text-[#c4c7c8] ${
        variant === 'danger'
          ? 'hover:bg-red-500/10 hover:text-red-400'
          : 'hover:bg-white/10 hover:text-white'
      } ${className ?? ''}`}
      {...props}
    >
      {icon}
    </button>
  );
}
