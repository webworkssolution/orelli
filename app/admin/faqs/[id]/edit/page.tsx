'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/admin/Toast';
import { Loader2 } from 'lucide-react';

export default function EditFaqPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { showToast } = useToast();

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [order, setOrder] = useState(0);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchFaq = async () => {
      try {
        const res = await fetch(`/api/admin/faqs/${params.id}`);
        if (!res.ok) throw new Error('FAQ not found');
        const data = await res.json();
        setQuestion(data.question);
        setAnswer(data.answer);
        setOrder(data.order);
      } catch (err) {
        showToast('Failed to load FAQ', 'error');
        router.push('/admin/faqs');
      } finally {
        setLoading(false);
      }
    };
    fetchFaq();
  }, [params.id, router, showToast]); // eslint-disable-line react-hooks/exhaustive-deps

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!question.trim()) errs.question = 'Question is required';
    if (!answer.trim()) errs.answer = 'Answer is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/faqs/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, answer, order }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to update FAQ');
      }

      showToast('FAQ updated successfully', 'success');
      router.push('/admin/faqs');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to update FAQ', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-[#C9A96E] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="admin-card p-6 space-y-5">
          <h3 className="text-sm font-medium text-[#f5f5f5]">Edit FAQ Details</h3>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#999] mb-2">
              Question <span className="text-[#ef4444]">*</span>
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="admin-input"
            />
            {errors.question && (
              <p className="text-xs text-[#ef4444] mt-1">{errors.question}</p>
            )}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#999] mb-2">
              Answer <span className="text-[#ef4444]">*</span>
            </label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={5}
              className="admin-input resize-none"
            />
            {errors.answer && (
              <p className="text-xs text-[#ef4444] mt-1">{errors.answer}</p>
            )}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#999] mb-2">
              Display Order
            </label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
              className="admin-input w-24"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/faqs')}
            className="px-5 py-2.5 text-sm rounded-md text-[#999] hover:text-[#f5f5f5] hover:bg-[#252525] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 text-sm rounded-md bg-[#C9A96E] text-[#0f0f0f] font-medium hover:bg-[#d4b87a] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
