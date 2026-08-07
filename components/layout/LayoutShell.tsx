'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StickyActionBar from '@/components/layout/StickyActionBar';

export default function LayoutShell({ 
  children, 
  categories = [] 
}: { 
  children: React.ReactNode;
  categories?: { title: string; slug: string }[];
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar categories={categories} />
      <main>{children}</main>
      <Footer />
      <StickyActionBar />
    </>
  );
}
