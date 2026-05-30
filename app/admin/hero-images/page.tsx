'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/admin/Toast';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import ImagePicker from '@/components/admin/ImagePicker';
import { Plus, Trash2, GripVertical, Loader2, ImageIcon } from 'lucide-react';

interface HeroImage {
  id: string;
  src: string;
  alt: string;
  order: number;
}

export default function HeroImagesPage() {
  const { showToast } = useToast();
  const [images, setImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<HeroImage | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/hero-images');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setImages(Array.isArray(data) ? data : []);
    } catch {
      showToast('Failed to load hero images', 'error');
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleAddImage = async (path: string) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/hero-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          src: path,
          alt: '',
          order: images.length,
        }),
      });
      if (!res.ok) throw new Error('Failed to add');
      showToast('Hero image added', 'success');
      fetchImages();
    } catch {
      showToast('Failed to add hero image', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/hero-images?id=${deleteTarget.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');
      setImages((prev) => prev.filter((img) => img.id !== deleteTarget.id));
      showToast('Hero image removed', 'success');
    } catch {
      showToast('Failed to delete hero image', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = async (dropIndex: number) => {
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }

    const reordered = [...images];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(dropIndex, 0, moved);
    setImages(reordered);
    setDragIndex(null);
    setDragOverIndex(null);

    // Save new order to backend
    try {
      const res = await fetch('/api/admin/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'heroImage',
          items: reordered.map((img, i) => ({ id: img.id, order: i })),
        }),
      });
      if (!res.ok) throw new Error('Failed to reorder');
      showToast('Order updated', 'success');
    } catch {
      showToast('Failed to save order', 'error');
      fetchImages(); // revert
    }
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="admin-skeleton h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl text-[#f5f5f5]">Hero Images</h2>
          <p className="text-sm text-[#666] mt-1">
            Manage the slideshow images displayed on the homepage hero section.
          </p>
        </div>
        <button
          onClick={() => setPickerOpen(true)}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#C9A96E] text-[#0f0f0f] text-sm font-medium hover:bg-[#d4b87a] disabled:opacity-50 transition-colors"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          Add Image
        </button>
      </div>

      {/* Info card */}
      <div className="admin-card p-4 mb-6 border-l-[3px] border-[#C9A96E]">
        <p className="text-xs text-[#999]">
          <span className="text-[#C9A96E] font-medium">Tip:</span> Drag and
          drop images to reorder them. The first image will be shown initially
          when a visitor opens the website.
        </p>
      </div>

      {/* Images grid */}
      {images.length === 0 ? (
        <div className="admin-card p-16 text-center">
          <ImageIcon className="w-12 h-12 text-[#444] mx-auto mb-4" />
          <p className="text-[#666] text-sm mb-4">
            No hero images added yet.
          </p>
          <button
            onClick={() => setPickerOpen(true)}
            className="px-4 py-2 text-sm rounded-md bg-[#252525] text-[#999] hover:text-[#f5f5f5] hover:bg-[#2a2a2a] transition-colors"
          >
            + Add your first hero image
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img, index) => (
            <div
              key={img.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={() => handleDrop(index)}
              onDragEnd={handleDragEnd}
              className={`
                admin-card overflow-hidden group transition-all duration-200
                ${dragIndex === index ? 'opacity-40 scale-95' : ''}
                ${dragOverIndex === index && dragIndex !== index ? 'ring-2 ring-[#C9A96E] ring-offset-2 ring-offset-[#1a1a1a]' : ''}
                hover:border-[#3a3a3a] cursor-grab active:cursor-grabbing
              `}
            >
              {/* Image preview */}
              <div className="relative h-48 bg-[#252525] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.alt || `Hero image ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Order badge */}
                <div className="absolute top-3 left-3 bg-black/70 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
                  #{index + 1}
                </div>

                {/* Drag handle overlay */}
                <div className="absolute top-3 right-3 bg-black/70 text-white p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                  <GripVertical className="w-4 h-4" />
                </div>
              </div>

              {/* Controls */}
              <div className="p-3 flex items-center justify-between border-t border-[#2a2a2a]">
                <span className="text-xs text-[#666] truncate max-w-[200px]">
                  {img.src.split('/').pop()}
                </span>
                <button
                  onClick={() => setDeleteTarget(img)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-500 hover:bg-[#ef4444]/10 rounded-md transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Picker Modal */}
      <ImagePicker
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleAddImage}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Remove Hero Image"
        message="Are you sure you want to remove this image from the hero slideshow? The image will remain in your media library."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
