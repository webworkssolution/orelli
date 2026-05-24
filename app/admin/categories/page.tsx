'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/admin/Toast';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { Plus, Pencil, Trash2, FolderOpen } from 'lucide-react';

interface Category {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageSrc: string;
  tags: string[];
  order: number;
  createdAt: string;
}

export default function CategoriesPage() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setCategories(data);
    } catch {
      showToast('Failed to load categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/categories/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      showToast('Category deleted', 'success');
    } catch {
      showToast('Failed to delete category', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="admin-skeleton h-8 w-48" />
          <div className="admin-skeleton h-10 w-36 rounded-md" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="admin-card overflow-hidden">
              <div className="admin-skeleton h-40 w-full" />
              <div className="p-4 space-y-2">
                <div className="admin-skeleton h-5 w-3/4" />
                <div className="admin-skeleton h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl text-[#f5f5f5]">All Categories</h2>
          <p className="text-sm text-[#666] mt-1">{categories.length} categories</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#C9A96E] text-[#0f0f0f] text-sm font-medium hover:bg-[#d4b87a] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </Link>
      </div>

      {/* Grid */}
      {categories.length === 0 ? (
        <div className="admin-card flex flex-col items-center justify-center py-16 text-[#666]">
          <FolderOpen className="w-12 h-12 mb-3" />
          <p className="text-sm">No categories yet</p>
          <Link
            href="/admin/categories/new"
            className="mt-4 text-sm text-[#C9A96E] hover:text-[#d4b87a] transition-colors"
          >
            Create your first category →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="admin-card overflow-hidden group hover:border-[#3a3a3a] transition-colors"
            >
              {/* Thumbnail */}
              <div className="relative h-40 bg-[#252525] overflow-hidden">
                {cat.imageSrc ? (
                  <img
                    src={cat.imageSrc}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FolderOpen className="w-8 h-8 text-[#666]" />
                  </div>
                )}
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-xs bg-black/60 text-[#999]">
                  #{cat.order}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-sm font-medium text-[#f5f5f5] mb-1 truncate">
                  {cat.title}
                </h3>
                <p className="text-xs text-[#666] line-clamp-2 mb-3">
                  {cat.description || 'No description'}
                </p>

                {/* Tags */}
                {cat.tags && cat.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {cat.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 text-[10px] rounded-full bg-[#252525] text-[#999]"
                      >
                        {tag}
                      </span>
                    ))}
                    {cat.tags.length > 3 && (
                      <span className="px-2 py-0.5 text-[10px] text-[#666]">
                        +{cat.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-[#2a2a2a]">
                  <Link
                    href={`/admin/categories/${cat.id}/edit`}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md text-[#999] hover:text-[#f5f5f5] hover:bg-[#252525] transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </Link>
                  <button
                    onClick={() => setDeleteTarget(cat)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md text-[#999] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
