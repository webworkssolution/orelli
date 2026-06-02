'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/admin/Toast';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { Plus, Pencil, Trash2, FolderOpen, Star } from 'lucide-react';

interface ListItem { id: string; title: string; slug: string; imageSrc?: string; heroImage?: string; featured?: boolean }

export default function Page() {
  const { showToast } = useToast();
  const [items, setItems] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<ListItem | null>(null);

  useEffect(() => {
    fetch('/api/admin/projects').then(r => r.json()).then(setItems).catch(() => showToast('Error', 'error')).finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await fetch(`/api/admin/projects/${deleteTarget.id}`, { method: 'DELETE' });
      setItems(prev => prev.filter(i => i.id !== deleteTarget.id));
      showToast('Deleted', 'success');
    } catch {
      showToast('Error', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const toggleFeatured = async (item: ListItem) => {
    const newFeatured = !item.featured;
    try {
      await fetch(`/api/admin/projects/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: newFeatured }),
      });
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, featured: newFeatured } : i));
      showToast(newFeatured ? 'Shown on homepage' : 'Hidden from homepage', 'success');
    } catch {
      showToast('Error updating', 'error');
    }
  };

  if (loading) return <div className="max-w-5xl mx-auto"><div className="admin-skeleton h-96 w-full" /></div>;

  if(items.length === 0) return (
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl text-[#f5f5f5]">Projects</h2>
            <Link href="/admin/projects/new" className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#C9A96E] text-[#0f0f0f] text-sm font-medium hover:bg-[#d4b87a]">
                <Plus className="w-4 h-4" /> Add
            </Link>
        </div>
        <div className="admin-card p-10 text-center text-[#666]">No items found.</div>
      </div>
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl text-[#f5f5f5]">Projects</h2>
        <Link href="/admin/projects/new" className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#C9A96E] text-[#0f0f0f] text-sm font-medium hover:bg-[#d4b87a]">
          <Plus className="w-4 h-4" /> Add
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((cat) => (
          <div key={cat.id} className={`admin-card overflow-hidden group transition-colors ${cat.featured ? 'border-[#C9A96E]/50 hover:border-[#C9A96E]' : 'hover:border-[#3a3a3a]'}`}>
            <div className="relative h-40 bg-[#252525] overflow-hidden">
              {cat.imageSrc || cat.heroImage ? (
                <img src={cat.imageSrc || cat.heroImage} alt={cat.title} className="w-full h-full object-cover" />
              ) : <div className="w-full h-full flex items-center justify-center"><FolderOpen className="w-8 h-8 text-[#666]" /></div>}
              {cat.featured && (
                <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-[#C9A96E] text-[#0f0f0f]">
                  <Star className="w-3 h-3" /> HOMEPAGE
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-sm font-medium text-[#f5f5f5] mb-1 truncate">{cat.title}</h3>
              <div className="flex items-center gap-2 pt-3 border-t border-[#2a2a2a]">
                <button onClick={() => toggleFeatured(cat)} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-colors ${cat.featured ? 'text-[#C9A96E] hover:bg-[#C9A96E]/10' : 'text-[#999] hover:text-[#f5f5f5] hover:bg-[#252525]'}`} title={cat.featured ? 'Remove from homepage' : 'Show on homepage'}>
                  <Star className={`w-3.5 h-3.5 ${cat.featured ? 'fill-[#C9A96E]' : ''}`} />{cat.featured ? 'Featured' : 'Feature'}
                </button>
                <Link href={`/admin/projects/${cat.id}/edit`} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#999] hover:text-[#f5f5f5] hover:bg-[#252525] rounded-md transition-colors"><Pencil className="w-3.5 h-3.5"/>Edit</Link>
                <button onClick={() => setDeleteTarget(cat)} className="text-red-500 flex items-center gap-1.5 px-3 py-1.5 text-xs hover:bg-[#ef4444]/10 rounded-md transition-colors"><Trash2 className="w-3.5 h-3.5"/>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ConfirmDialog isOpen={!!deleteTarget} title="Delete" message="Are you sure?" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
