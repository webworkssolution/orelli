'use client';

import { signOut } from 'next-auth/react';
import { Menu, LogOut } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  onMenuToggle: () => void;
}

export default function AdminHeader({ title, onMenuToggle }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0f0f0f]/80 backdrop-blur-md border-b border-[#2a2a2a] flex items-center justify-between px-6">
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden text-[#999] hover:text-[#f5f5f5] transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1
          className="text-lg font-medium text-[#f5f5f5]"
          style={{ fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)' }}
        >
          {title}
        </h1>
      </div>

      {/* Right: logout */}
      <button
        onClick={() => signOut({ callbackUrl: '/admin/login' })}
        className="flex items-center gap-2 text-sm text-[#999] hover:text-[#ef4444] transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </header>
  );
}
