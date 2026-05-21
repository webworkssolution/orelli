import './admin-globals.css';
import AdminProviders from '@/components/admin/AdminProviders';
import AdminShell from '@/components/admin/AdminShell';

export const metadata = {
  title: 'Orelli CMS',
  description: 'Content management for Orelli Bombay',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProviders>
      <AdminShell>{children}</AdminShell>
    </AdminProviders>
  );
}
