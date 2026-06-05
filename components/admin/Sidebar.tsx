'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  FolderOpen,
  Briefcase,
  FileText,
  Image,
  Wallpaper,
  X,
  LogOut,
  HelpCircle,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/hero-images', label: 'Hero Images', icon: Wallpaper },
  { href: '/admin/categories', label: 'Categories', icon: FolderOpen },
  { href: '/admin/projects', label: 'Projects', icon: Briefcase },
  { href: '/admin/blogs', label: 'Blogs', icon: FileText },
  { href: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
  { href: '/admin/images', label: 'Images', icon: Image },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-[280px] bg-[#1a1a1a] border-r border-[#2a2a2a]
          flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo area */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-[#2a2a2a]">
          <Link href="/admin" className="flex items-center gap-2" onClick={onClose}>
            <span className="text-xl tracking-[0.15em] text-[#C9A96E] font-cormorant">
              ORELLI
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#666] mt-1">CMS</span>
          </Link>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="lg:hidden text-[#666] hover:text-[#f5f5f5] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-200
                  ${
                    active
                      ? 'bg-[#C9A96E]/10 text-[#C9A96E] border-l-[3px] border-[#C9A96E] pl-[9px]'
                      : 'text-[#999] hover:text-[#f5f5f5] hover:bg-[#252525] border-l-[3px] border-transparent pl-[9px]'
                  }
                `}
              >
                <Icon className="w-[18px] h-[18px] shrink-0" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout button */}
        <div className="px-3 py-4 border-t border-[#2a2a2a]">
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-[#999] hover:text-[#ef4444] hover:bg-[#ef4444]/10 border-l-[3px] border-transparent pl-[9px] w-full transition-all duration-200"
          >
            <LogOut className="w-[18px] h-[18px] shrink-0" />
            <span className="font-medium">Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
