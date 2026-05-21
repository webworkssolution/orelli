'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/admin/Toast';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { Plus, Pencil, Trash2, FolderOpen } from 'lucide-react';

export default function Page() {
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch('/api/admin/blogs').then(r => r.json()).then(setItems).catch(() => showToast('Error', 'error')).finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/admin/blogs/${deleteTarget.id}`, { method: 'DELETE' });
      setItems(prev => prev.filter(i => i.id !== deleteTarget.id));
      showToast('Deleted', 'success');
    } catch {
      showToast('Error', 'error');
    } finally {
      setDeleting(false); setDeleteTarget(null);
    }
  };

  if(!loading && items.length === 0) return (
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl text-[#f5f5f5]">Blogs</h2>
            <Link href="/admin/blogs/new" className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#C9A96E] text-[#0f0f0f] text-sm font-medium hover:bg-[#d4b87a]">
                <Plus className="w-4 h-4" /> Add
            </Link>
        </div>
        <div className="admin-card p-10 text-center text-[#666]">No items found.</div>
      </div>
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl text-[#f5f5f5]">Blogs</h2>
        <Link href="/admin/blogs/new" className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#C9A96E] text-[#0f0f0f] text-sm font-medium hover:bg-[#d4b87a]">
          <Plus className="w-4 h-4" /> Add
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((cat: any) => (
          <div key={cat.id} className="admin-card overflow-hidden group hover:border-[#3a3a3a] transition-colors">
            <div className="relative h-40 bg-[#252525] overflow-hidden">
              {cat.imageSrc || cat.heroImage ? (
                <img src={cat.imageSrc || cat.heroImage} alt="img" className="w-full h-full object-cover" />
              ) : <div className="w-full h-full flex items-center justify-center"><FolderOpen className="w-8 h-8 text-[#666]" /></div>}
            </div>
            <div className="p-4">
              <h3 className="text-sm font-medium text-[#f5f5f5] mb-1 truncate">{cat.title}</h3>
              <div className="flex items-center gap-2 pt-3 border-t border-[#2a2a2a]">
                <Link href={`/admin/blogs/${cat.id}/edit`} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#999] hover:text-[#f5f5f5] hover:bg-[#252525] rounded-md transition-colors"><Pencil className="w-3.5 h-3.5"/>Edit</Link>
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
