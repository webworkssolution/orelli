'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X } from 'lucide-react';

interface ImageUploaderProps {
  onUpload: (path: string) => void;
  currentImage?: string;
}

export default function ImageUploader({ onUpload, currentImage }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);

      // Validate
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('File must be under 10 MB');
        return;
      }

      // Show local preview
      const localUrl = URL.createObjectURL(file);
      setPreview(localUrl);
      setUploading(true);

      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Upload failed');
        }

        const data = await res.json();
        setPreview(data.path);
        onUpload(data.path);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed');
        setPreview(currentImage || null);
      } finally {
        setUploading(false);
      }
    },
    [onUpload, currentImage]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const clearImage = () => {
    setPreview(null);
    setError(null);
    onUpload('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      {preview ? (
        /* Preview state */
        <div className="relative group rounded-lg overflow-hidden border border-[#2a2a2a]">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover"
          />
          {uploading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="admin-spinner" />
            </div>
          )}
          {!uploading && (
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#ef4444]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        /* Drop zone */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            flex flex-col items-center justify-center gap-3 p-8 rounded-lg border-2 border-dashed cursor-pointer
            transition-all duration-200
            ${
              dragOver
                ? 'border-[#C9A96E] bg-[#C9A96E]/5'
                : 'border-[#2a2a2a] hover:border-[#666] bg-[#1a1a1a]'
            }
          `}
        >
          {uploading ? (
            <div className="admin-spinner" />
          ) : (
            <>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#252525]">
                <Upload className="w-5 h-5 text-[#999]" />
              </div>
              <div className="text-center">
                <p className="text-sm text-[#f5f5f5]">
                  Drop an image here, or{' '}
                  <span className="text-[#C9A96E]">browse</span>
                </p>
                <p className="text-xs text-[#666] mt-1">PNG, JPG, WebP up to 10 MB</p>
              </div>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

      {error && (
        <p className="text-sm text-[#ef4444]">{error}</p>
      )}
    </div>
  );
}
