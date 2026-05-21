'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FolderOpen, Briefcase, FileText, Image, ArrowRight, Loader2 } from 'lucide-react';

interface Stats {
  categories: number;
  projects: number;
  blogs: number;
  images: number;
}

const statCards = [
  {
    key: 'categories' as const,
    label: 'Categories',
    href: '/admin/categories',
    icon: FolderOpen,
    color: '#C9A96E',
  },
  {
    key: 'projects' as const,
    label: 'Projects',
    href: '/admin/projects',
    icon: Briefcase,
    color: '#60a5fa',
  },
  {
    key: 'blogs' as const,
    label: 'Blogs',
    href: '/admin/blogs',
    icon: FileText,
    color: '#4ade80',
  },
  {
    key: 'images' as const,
    label: 'Images',
    href: '/admin/images',
    icon: Image,
    color: '#f59e0b',
  },
];

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to fetch from stats API, fall back to individual endpoints
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
          return;
        }
      } catch {}

      // Fallback: fetch counts from individual endpoints
      try {
        const [catRes, projRes, blogRes, imgRes] = await Promise.allSettled([
          fetch('/api/admin/categories'),
          fetch('/api/admin/projects'),
          fetch('/api/admin/blogs'),
          fetch('/api/admin/upload'),
        ]);

        const getCount = async (result: PromiseSettledResult<Response>) => {
          if (result.status === 'fulfilled' && result.value.ok) {
            const data = await result.value.json();
            return Array.isArray(data) ? data.length : 0;
          }
          return 0;
        };

        setStats({
          categories: await getCount(catRes),
          projects: await getCount(projRes),
          blogs: await getCount(blogRes),
          images: await getCount(imgRes),
        });
      } catch {
        setStats({ categories: 0, projects: 0, blogs: 0, images: 0 });
      } finally {
        setLoading(false);
      }
    }

    fetchStats().finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Welcome */}
      <div>
        <h2
          className="text-2xl text-[#f5f5f5] mb-1"
          style={{ fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)' }}
        >
          Welcome back{session?.user?.name ? `, ${session.user.name}` : ''}
        </h2>
        <p className="text-sm text-[#999]">
          Manage your content, images, and site settings.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.key}
              href={card.href}
              className="group admin-card p-6 hover:border-[#3a3a3a] transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#666] mb-1">
                    {card.label}
                  </p>
                  {loading ? (
                    <div className="admin-skeleton h-9 w-16 mt-1" />
                  ) : (
                    <p className="text-3xl font-light text-[#f5f5f5]">
                      {stats?.[card.key] ?? 0}
                    </p>
                  )}
                </div>
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-lg"
                  style={{ backgroundColor: `${card.color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color: card.color }} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs text-[#666] group-hover:text-[#C9A96E] transition-colors">
                <span>Manage {card.label.toLowerCase()}</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="admin-card p-6">
        <h3 className="text-sm font-medium text-[#f5f5f5] mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/categories/new"
            className="px-4 py-2 text-sm rounded-md bg-[#252525] text-[#999] hover:text-[#f5f5f5] hover:bg-[#2a2a2a] transition-colors"
          >
            + New Category
          </Link>
          <Link
            href="/admin/projects/new"
            className="px-4 py-2 text-sm rounded-md bg-[#252525] text-[#999] hover:text-[#f5f5f5] hover:bg-[#2a2a2a] transition-colors"
          >
            + New Project
          </Link>
          <Link
            href="/admin/blogs/new"
            className="px-4 py-2 text-sm rounded-md bg-[#252525] text-[#999] hover:text-[#f5f5f5] hover:bg-[#2a2a2a] transition-colors"
          >
            + New Blog
          </Link>
          <Link
            href="/admin/images"
            className="px-4 py-2 text-sm rounded-md bg-[#252525] text-[#999] hover:text-[#f5f5f5] hover:bg-[#2a2a2a] transition-colors"
          >
            Upload Images
          </Link>
        </div>
      </div>
    </div>
  );
}
