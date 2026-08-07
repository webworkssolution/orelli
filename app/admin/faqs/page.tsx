'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/admin/Toast';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { Plus, Pencil, Trash2, HelpCircle } from 'lucide-react';

interface Faq {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export default function FaqsPage() {
  const { showToast } = useToast();
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Faq | null>(null);

  const fetchFaqs = async () => {
    try {
      const res = await fetch('/api/admin/faqs');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setFaqs(data);
    } catch {
      showToast('Failed to load FAQs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/faqs/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
      setFaqs((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      showToast('FAQ deleted', 'success');
    } catch {
      showToast('Failed to delete FAQ', 'error');
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="admin-card overflow-hidden p-6">
              <div className="admin-skeleton h-5 w-3/4 mb-3" />
              <div className="admin-skeleton h-4 w-full mb-1" />
              <div className="admin-skeleton h-4 w-5/6" />
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
          <h2 className="text-xl text-[#f5f5f5]">All FAQs</h2>
          <p className="text-sm text-[#666] mt-1">{faqs.length} questions</p>
        </div>
        <Link
          href="/admin/faqs/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#C9A96E] text-[#0f0f0f] text-sm font-medium hover:bg-[#d4b87a] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add FAQ
        </Link>
      </div>

      {/* Grid */}
      {faqs.length === 0 ? (
        <div className="admin-card flex flex-col items-center justify-center py-16 text-[#666]">
          <HelpCircle className="w-12 h-12 mb-3" />
          <p className="text-sm">No FAQs yet</p>
          <Link
            href="/admin/faqs/new"
            className="mt-4 text-sm text-[#C9A96E] hover:text-[#d4b87a] transition-colors"
          >
            Create your first FAQ →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="admin-card overflow-hidden group hover:border-[#3a3a3a] transition-colors flex flex-col"
            >
              {/* Content */}
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h3 className="text-sm font-medium text-[#f5f5f5] line-clamp-2">
                    {faq.question}
                  </h3>
                  <div className="px-2 py-0.5 rounded text-xs bg-[#252525] text-[#999] whitespace-nowrap">
                    Order: {faq.order}
                  </div>
                </div>
                <p className="text-xs text-[#666] line-clamp-3">
                  {faq.answer}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 p-3 border-t border-[#2a2a2a] bg-[#1c1c1c]/50">
                <Link
                  href={`/admin/faqs/${faq.id}/edit`}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md text-[#999] hover:text-[#f5f5f5] hover:bg-[#252525] transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </Link>
                <button
                  onClick={() => setDeleteTarget(faq)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md text-[#999] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete FAQ"
        message={`Are you sure you want to delete this FAQ? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
