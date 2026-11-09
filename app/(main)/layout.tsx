import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

// Root layout নয় — এই layout শুধু (main) group-এর পেজে প্রযোজ্য, তাই dashboard/auth-এ navbar/footer আসবে না
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
