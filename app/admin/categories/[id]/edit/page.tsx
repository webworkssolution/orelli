'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/components/admin/Toast';
import ImageUploader from '@/components/admin/ImageUploader';
import ImagePicker from '@/components/admin/ImagePicker';
import { Loader2, Plus, X, ImageIcon } from 'lucide-react';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToast();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManual, setSlugManual] = useState(true);
  const [description, setDescription] = useState('');
  const [detailDescription, setDetailDescription] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [gallery, setGallery] = useState<string[]>([]);
  const [order, setOrder] = useState(0);

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [galleryPickerOpen, setGalleryPickerOpen] = useState(false);

  useEffect(() => {
    async function fetchCategory() {
      try {
        const res = await fetch(`/api/admin/categories/${id}`);
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        setTitle(data.title || '');
        setSlug(data.slug || '');
        setDescription(data.description || '');
        setDetailDescription(data.detailDescription || '');
        setImageSrc(data.imageSrc || '');
        setTagsInput(Array.isArray(data.tags) ? data.tags.join(', ') : '');
        setGallery(Array.isArray(data.gallery) ? data.gallery : []);
        setOrder(data.order ?? 0);
      } catch {
        showToast('Failed to load category', 'error');
        router.push('/admin/categories');
      } finally {
        setLoading(false);
      }
    }
    fetchCategory();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugManual) setSlug(slugify(value));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!slug.trim()) errs.slug = 'Slug is required';
    if (!imageSrc.trim()) errs.imageSrc = 'Image is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          description,
          detailDescription,
          imageSrc,
          tags,
          gallery,
          order,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to update');
      }

      showToast('Category updated successfully', 'success');
      router.push('/admin/categories');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to update category', 'error');
    } finally {
      setSaving(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGallery((prev) => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="admin-card p-6 space-y-5">
          <div className="admin-skeleton h-5 w-40" />
          <div className="admin-skeleton h-10 w-full" />
          <div className="admin-skeleton h-10 w-full" />
          <div className="admin-skeleton h-24 w-full" />
        </div>
        <div className="admin-card p-6">
          <div className="admin-skeleton h-48 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title & Slug */}
        <div className="admin-card p-6 space-y-5">
          <h3 className="text-sm font-medium text-[#f5f5f5]">Basic Information</h3>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#999] mb-2">
              Title <span className="text-[#ef4444]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="admin-input"
            />
            {errors.title && <p className="text-xs text-[#ef4444] mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#999] mb-2">
              Slug <span className="text-[#ef4444]">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlugManual(true);
                  setSlug(e.target.value);
                }}
                className="admin-input font-mono text-[13px]"
              />
              {slugManual && (
                <button
                  type="button"
                  onClick={() => {
                    setSlugManual(false);
                    setSlug(slugify(title));
                  }}
                  className="px-3 text-xs text-[#C9A96E] hover:text-[#d4b87a] whitespace-nowrap transition-colors"
                >
                  Auto
                </button>
              )}
            </div>
            {errors.slug && <p className="text-xs text-[#ef4444] mt-1">{errors.slug}</p>}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#999] mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="admin-input resize-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#999] mb-2">
              Detail Description
            </label>
            <textarea
              value={detailDescription}
              onChange={(e) => setDetailDescription(e.target.value)}
              rows={5}
              className="admin-input resize-none"
            />
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

        {/* Image */}
        <div className="admin-card p-6 space-y-4">
          <h3 className="text-sm font-medium text-[#f5f5f5]">
            Category Image <span className="text-[#ef4444]">*</span>
          </h3>
          <ImageUploader
            onUpload={(path) => {
              setImageSrc(path);
              if (errors.imageSrc) setErrors((prev) => ({ ...prev, imageSrc: '' }));
            }}
            currentImage={imageSrc}
          />
          {errors.imageSrc && <p className="text-xs text-[#ef4444]">{errors.imageSrc}</p>}
        </div>

        {/* Tags */}
        <div className="admin-card p-6 space-y-4">
          <h3 className="text-sm font-medium text-[#f5f5f5]">Tags</h3>
          <div>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="silk, luxury, handwoven (comma-separated)"
              className="admin-input"
            />
            <p className="text-xs text-[#666] mt-1">Separate tags with commas</p>
          </div>
        </div>

        {/* Gallery */}
        <div className="admin-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-[#f5f5f5]">Gallery</h3>
            <button
              type="button"
              onClick={() => setGalleryPickerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md bg-[#252525] text-[#999] hover:text-[#f5f5f5] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Image
            </button>
          </div>

          {gallery.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {gallery.map((src, index) => (
                <div
                  key={index}
                  className="relative group aspect-square rounded-lg overflow-hidden border border-[#2a2a2a]"
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(index)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#ef4444]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-[#666]">
              <ImageIcon className="w-8 h-8 mb-2" />
              <p className="text-xs">No gallery images</p>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/categories')}
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

      <ImagePicker
        isOpen={galleryPickerOpen}
        onClose={() => setGalleryPickerOpen(false)}
        onSelect={(path) => setGallery((prev) => [...prev, path])}
      />
    </div>
  );
}
