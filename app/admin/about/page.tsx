'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/admin/Toast';
import ImageUploader from '@/components/admin/ImageUploader';
import { Save } from 'lucide-react';

export default function AdminAboutPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [heading, setHeading] = useState('');
  const [paragraph1, setParagraph1] = useState('');
  const [quote, setQuote] = useState('');
  const [paragraph2, setParagraph2] = useState('');
  const [paragraph3, setParagraph3] = useState('');
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/admin/about');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        
        setHeading(data.heading || '');
        setParagraph1(data.paragraph1 || '');
        setQuote(data.quote || '');
        setParagraph2(data.paragraph2 || '');
        setParagraph3(data.paragraph3 || '');
        setImageSrc(data.imageSrc || '');
      } catch {
        showToast('Failed to load about content', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          heading,
          paragraph1,
          quote,
          paragraph2,
          paragraph3,
          imageSrc,
        }),
      });

      if (!res.ok) throw new Error('Failed to save');
      showToast('About page updated successfully', 'success');
    } catch {
      showToast('Failed to save changes', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-[#666] text-sm">Loading content...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl text-[#f5f5f5]">Edit About Page</h2>
          <p className="text-sm text-[#666] mt-1">Update the &quot;Our Story&quot; section</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-md bg-[#C9A96E] text-[#0f0f0f] text-sm font-medium hover:bg-[#d4b87a] transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="admin-card p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Heading</label>
              <input
                type="text"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                className="admin-input"
                placeholder="e.g. A legacy of textiles, reimagined for today."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Paragraph 1 (Intro)</label>
              <textarea
                value={paragraph1}
                onChange={(e) => setParagraph1(e.target.value)}
                rows={4}
                className="admin-input resize-none"
                placeholder="Orelli Bombay was born from a deep reverence..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#C9A96E] mb-2">Stylised Quote</label>
              <textarea
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                rows={3}
                className="admin-input resize-none border-[#C9A96E]/30 focus:border-[#C9A96E]"
                placeholder="True luxury lies in the unseen details..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Paragraph 2</label>
              <textarea
                value={paragraph2}
                onChange={(e) => setParagraph2(e.target.value)}
                rows={4}
                className="admin-input resize-none"
                placeholder="We collaborate directly with master weaving communities..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#f5f5f5] mb-2">Paragraph 3 (Conclusion)</label>
              <textarea
                value={paragraph3}
                onChange={(e) => setParagraph3(e.target.value)}
                rows={4}
                className="admin-input resize-none"
                placeholder="Every yard we create is a testament to slow production..."
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="admin-card p-6">
            <h3 className="text-sm font-medium text-[#f5f5f5] mb-4">Side Image</h3>
            <ImageUploader
              value={imageSrc}
              onChange={setImageSrc}
              folder="about"
            />
            <p className="text-xs text-[#666] mt-4">
              This image will be displayed on the right side of the story text. Recommended ratio: 3:4 or 4:5.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
