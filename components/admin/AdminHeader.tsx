'use client';

import Link from 'next/link';
import { Menu, ExternalLink } from 'lucide-react';

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

      {/* Right: visit site */}
      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-2 px-4 py-2 text-sm rounded-md border border-[#C9A96E]/40 text-[#C9A96E] hover:bg-[#C9A96E]/10 transition-colors"
      >
        <span>Visit Website</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </Link>
    </header>
  );
}

