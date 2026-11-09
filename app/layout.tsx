import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'HireLoop — Find Your Dream Job Today',
  description:
    'HireLoop connects top talent with world-class companies. Browse thousands of curated opportunities and land your next role — faster.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
