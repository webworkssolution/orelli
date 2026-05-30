'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useToast } from '@/components/admin/Toast';
import ImageUploader from '@/components/admin/ImageUploader';

const TiptapEditor = dynamic(() => import('@/components/admin/TiptapEditor'), { ssr: false });

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({ title: '', slug: '', description: '', excerpt: '', content: '', imageSrc: '', heroImage: '' });

  useEffect(() => {
    fetch(`/api/admin/blogs/${params.id}`).then(r => r.json()).then(setFormData);
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`/api/admin/blogs/${params.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      showToast('Updated', 'success');
      router.push('/admin/blogs');
    } catch {
      showToast('Error', 'error');
    }
  };

  if(!formData.title) return <div className="admin-skeleton w-full h-96" />;

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl text-[#f5f5f5] mb-6">Edit Blog</h2>
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
            <label className="block text-xs mb-1 text-[#999]">Excerpt</label>
            <textarea className="w-full admin-input" rows={2} placeholder="Short excerpt..." value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs mb-1 text-[#999]">Content</label>
            <TiptapEditor content={formData.content} onChange={(html: string) => setFormData({...formData, content: html})} />
          </div>
          <div>
            <label className="block text-xs mb-1 text-[#999]">Cover Image</label>
            <ImageUploader currentImage={formData.heroImage || formData.imageSrc} onUpload={(v: string) => setFormData({...formData, heroImage: v, imageSrc: v})} />
          </div>
          <div className="pt-4 border-t border-[#2a2a2a] flex justify-end">
             <button className="bg-[#C9A96E] hover:bg-[#d4b87a] text-black px-4 py-2 rounded text-sm font-medium">Update Blog</button>
          </div>
        </form>
      </div>
    </div>
  );
}
