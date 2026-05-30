'use client';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/admin/Toast';
import ImageUploader from '@/components/admin/ImageUploader';
import { Trash2 } from 'lucide-react';

interface UploadedImg { id: string; filename: string; path: string; size: number; mimeType: string }

export default function Page() {
  const { showToast } = useToast();
  const [images, setImages] = useState<UploadedImg[]>([]);

  const fetchImages = () => fetch('/api/admin/upload').then(r=>r.json()).then(setImages);
  useEffect(() => { fetchImages() }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const del = async(id: string) => {
    try {
      const res = await fetch(`/api/admin/upload?id=${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to delete image');
      }
      showToast('Image deleted successfully', 'success');
      fetchImages();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error deleting image', 'error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-xl text-[#f5f5f5] mb-6">Image Manager</h2>
      <div className="mb-8 p-6 admin-card">
          <h3 className="text-sm text-[#f5f5f5] mb-4">Upload New Image</h3>
          <ImageUploader onUpload={() => fetchImages()} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img.id} className="relative group rounded overflow-hidden bg-[#252525] border border-[#2a2a2a]">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src={img.path} alt={img.filename} className="w-full h-40 object-cover" />
             <div className="p-2 truncate text-xs text-[#999]">{img.filename}</div>
             <button onClick={()=>del(img.id)} className="absolute top-2 right-2 bg-black/80 rounded p-1.5 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
          </div>
        ))}
      </div>
    </div>
  );
}
