'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/admin/Toast';
import { Loader2 } from 'lucide-react';

export default function NewFaqPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [order, setOrder] = useState(0);

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      const res = await fetch('/api/admin/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, answer, order }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to create FAQ');
      }

      showToast('FAQ created successfully', 'success');
      router.push('/admin/faqs');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to create FAQ', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="admin-card p-6 space-y-5">
          <h3 className="text-sm font-medium text-[#f5f5f5]">FAQ Details</h3>

          <div>
            <label htmlFor="question" className="block text-xs uppercase tracking-wider text-[#999] mb-2">
              Question <span className="text-[#ef4444]">*</span>
            </label>
            <input
              id="question"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. What materials do you use?"
              className="admin-input"
            />
            {errors.question && (
              <p className="text-xs text-[#ef4444] mt-1">{errors.question}</p>
            )}
          </div>

          <div>
            <label htmlFor="answer" className="block text-xs uppercase tracking-wider text-[#999] mb-2">
              Answer <span className="text-[#ef4444]">*</span>
            </label>
            <textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={5}
              placeholder="Detailed answer..."
              className="admin-input resize-none"
            />
            {errors.answer && (
              <p className="text-xs text-[#ef4444] mt-1">{errors.answer}</p>
            )}
          </div>

          <div>
            <label htmlFor="order" className="block text-xs uppercase tracking-wider text-[#999] mb-2">
              Display Order
            </label>
            <input
              id="order"
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
            {saving ? 'Creating…' : 'Create FAQ'}
          </button>
        </div>
      </form>
    </div>
  );
}
