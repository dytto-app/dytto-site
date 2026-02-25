import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
