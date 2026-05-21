'use client';

import { useState, useEffect } from 'react';
import { X, Search, ImageIcon, Loader2 } from 'lucide-react';

interface ImagePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (path: string) => void;
}

interface UploadedImage {
  id: string;
  filename: string;
  path: string;
  size: number;
  mimeType: string;
  createdAt: string;
}

export default function ImagePicker({ isOpen, onClose, onSelect }: ImagePickerProps) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetch('/api/admin/upload')
      .then((res) => res.json())
      .then((data) => setImages(Array.isArray(data) ? data : []))
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = images.filter((img) =>
    img.filename.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 dialog-backdrop" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-3xl max-h-[80vh] bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-2xl dialog-panel flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2a] shrink-0">
          <h3 className="text-lg font-semibold text-[#f5f5f5]">Select Image</h3>
          <button
            onClick={onClose}
            className="text-[#666] hover:text-[#f5f5f5] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-[#2a2a2a] shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
            <input
              type="text"
              placeholder="Search images..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="admin-input pl-9"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-[#C9A96E] animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-[#666]">
              <ImageIcon className="w-12 h-12 mb-3" />
              <p className="text-sm">
                {search ? 'No images match your search' : 'No images uploaded yet'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filtered.map((img) => (
                <button
                  key={img.id}
                  onClick={() => {
                    onSelect(img.path);
                    onClose();
                  }}
                  className="group relative aspect-square rounded-lg overflow-hidden border border-[#2a2a2a] hover:border-[#C9A96E] transition-colors"
                >
                  <img
                    src={img.path}
                    alt={img.filename}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                    <span className="w-full px-2 py-1.5 text-xs text-white truncate bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                      {img.filename}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
