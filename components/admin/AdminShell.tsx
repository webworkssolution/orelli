'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import AdminHeader from '@/components/admin/AdminHeader';

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/hero-images': 'Hero Images',
  '/admin/categories': 'Categories',
  '/admin/categories/new': 'New Category',
  '/admin/projects': 'Projects',
  '/admin/projects/new': 'New Project',
  '/admin/blogs': 'Blogs',
  '/admin/blogs/new': 'New Blog',
  '/admin/faqs': 'FAQs',
  '/admin/faqs/new': 'New FAQ',
  '/admin/images': 'Images',
};

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Login page: render without sidebar/header
  const isLoginPage = pathname === '/admin/login';
  if (isLoginPage) {
    return <div className="admin-shell">{children}</div>;
  }

  // Determine page title from route
  const title =
    pageTitles[pathname] ||
    (pathname.includes('/edit') ? 'Edit' : 'Admin');

  return (
    <div className="admin-shell">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area — offset by sidebar on desktop */}
      <div className="lg:ml-[280px] min-h-screen flex flex-col">
        <AdminHeader title={title} onMenuToggle={() => setSidebarOpen(true)} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
