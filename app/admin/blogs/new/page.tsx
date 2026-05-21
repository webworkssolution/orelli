'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/admin/Toast';
import ImageUploader from '@/components/admin/ImageUploader';

export default function Page() {
  const router = useRouter();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({ title: '', slug: '', description: '', excerpt: '', content: '', imageSrc: '', heroImage: '', date: new Date().toISOString().split('T')[0] });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await fetch('/api/admin/blogs', { method: 'POST', body: JSON.stringify(formData) });
      showToast('Created', 'success');
      router.push('/admin/blogs');
    } catch {
      showToast('Error', 'error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl text-[#f5f5f5] mb-6">New Blog</h2>
      <div className="admin-card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs mb-1 text-[#999]">Title</label>
            <input className="w-full admin-input" placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required/>
          </div>
          <div>
            <label className="block text-xs mb-1 text-[#999]">Slug</label>
            <input className="w-full admin-input" placeholder="Slug" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} required/>
          </div>
          <div>
            <label className="block text-xs mb-1 text-[#999]">Description/Content</label>
            <textarea className="w-full admin-input" rows={4} placeholder="Description or content..." value={formData.description || formData.content} onChange={e => setFormData({...formData, description: e.target.value, content: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs mb-1 text-[#999]">Cover Image</label>
            <ImageUploader currentImage={formData.imageSrc} onUpload={(v: string) => setFormData({...formData, imageSrc: v})} />
          </div>
          <div className="pt-4 border-t border-[#2a2a2a] flex justify-end">
             <button className="bg-[#C9A96E] hover:bg-[#d4b87a] text-black px-4 py-2 rounded text-sm font-medium">Save Blog</button>
          </div>
        </form>
      </div>
    </div>
  );
}
