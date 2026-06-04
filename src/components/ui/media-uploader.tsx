'use client';

import { useState, useRef, DragEvent } from 'react';

interface UploaderProps {
  onUploadComplete?: (urls: string[]) => void;
  maxFiles?: number;
}

interface UploadedFile {
  id: string;
  name: string;
  originalSize: number;
  compressedSize: number;
  dataUrl: string;
}

export default function MediaUploader({ onUploadComplete, maxFiles = 5 }: UploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Client-side Canvas Image Compression
  const compressImage = (file: File): Promise<UploadedFile> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Resize max bounds (e.g. 1200px max)
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('canvas context creation failed'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Compress to JPEG with 75% quality
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.75);
          
          // Estimate compressed size in bytes from base64 length
          const compressedSize = Math.round((compressedDataUrl.length * 3) / 4);

          resolve({
            id: Math.random().toString(36).substring(7),
            name: file.name,
            originalSize: file.size,
            compressedSize,
            dataUrl: compressedDataUrl,
          });
        };
        img.onerror = () => reject(new Error('image loading failed'));
        img.src = event.target?.result as string;
      };
      reader.onerror = () => reject(new Error('file reading failed'));
      reader.readAsDataURL(file);
    });
  };

  const processFiles = async (selectedFiles: FileList) => {
    if (files.length >= maxFiles) return;
    setCompressing(true);

    const promises = [];
    const countLimit = Math.min(selectedFiles.length, maxFiles - files.length);
    
    for (let i = 0; i < countLimit; i++) {
      const file = selectedFiles[i];
      if (file.type.startsWith('image/')) {
        promises.push(compressImage(file));
      }
    }

    try {
      const newUploadedFiles = await Promise.all(promises);
      const updatedFiles = [...files, ...newUploadedFiles];
      setFiles(updatedFiles);
      if (onUploadComplete) {
        onUploadComplete(updatedFiles.map(f => f.dataUrl));
      }
    } catch (err) {
      console.error('image compression error:', err);
    } finally {
      setCompressing(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const removeFile = (id: string) => {
    const updated = files.filter((f) => f.id !== id);
    setFiles(updated);
    if (onUploadComplete) {
      onUploadComplete(updated.map((f) => f.dataUrl));
    }
  };

  // Reorder / sorting priority handlers
  const movePriority = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === files.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newFiles = [...files];
    const temp = newFiles[index];
    newFiles[index] = newFiles[targetIndex];
    newFiles[targetIndex] = temp;

    setFiles(newFiles);
    if (onUploadComplete) {
      onUploadComplete(newFiles.map((f) => f.dataUrl));
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 b';
    const k = 1024;
    const dm = 1;
    const sizes = ['b', 'kb', 'mb'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4 text-sm">
      {/* Drag & Drop Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed ${
          isDragging ? 'border-black bg-neutral-100' : 'border-neutral-300 hover:border-black bg-neutral-50'
        } p-8 text-center cursor-pointer transition-colors duration-150 rounded-xl flex flex-col items-center justify-center min-h-[160px]`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept="image/*"
          className="hidden"
        />
        <div className="space-y-2">
          <span className="text-2xl mb-2 block">📷</span>
          <span className="block font-medium text-base text-neutral-800">
            {isDragging ? 'Drop files here' : 'Drag & drop files or click to browse'}
          </span>
          <span className="block text-sm text-neutral-500">
            Up to {maxFiles} images. High-fidelity compression is applied instantly.
          </span>
        </div>
      </div>

      {compressing && (
        <div className="text-sm text-neutral-500 animate-pulse">
          ⚡ Compressing assets...
        </div>
      )}

      {/* Uploaded File List / Reorder Row */}
      {files.length > 0 && (
        <div className="space-y-3 mt-6">
          <span className="font-semibold text-sm text-neutral-800 block">Upload Queue & Sort Priority</span>
          
          <div className="border border-neutral-200 divide-y divide-neutral-100 rounded-xl bg-white overflow-hidden shadow-sm">
            {files.map((file, idx) => {
              const savings = Math.round(((file.originalSize - file.compressedSize) / file.originalSize) * 100);

              return (
                <div key={file.id} className="p-3 flex items-center justify-between gap-4 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center gap-3">
                    {/* Thumbnail */}
                    <div className="w-12 h-12 border border-neutral-200 rounded-md overflow-hidden bg-neutral-100 flex-shrink-0">
                      <img src={file.dataUrl} alt="upload preview" className="w-full h-full object-cover" />
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-sm max-w-[200px] truncate block text-neutral-800">{file.name}</span>
                      <span className="text-xs text-neutral-500">
                        {formatBytes(file.compressedSize)} (saved {savings}%)
                      </span>
                    </div>
                  </div>

                  {/* Actions & Sorting */}
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-md">
                      Rank {idx + 1}
                    </span>

                    {/* Priority buttons */}
                    <button
                      type="button"
                      onClick={() => movePriority(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 text-neutral-400 hover:text-neutral-800 hover:bg-neutral-200 rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                      title="Move priority up"
                    >
                      ▲
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => movePriority(idx, 'down')}
                      disabled={idx === files.length - 1}
                      className="p-1.5 text-neutral-400 hover:text-neutral-800 hover:bg-neutral-200 rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                      title="Move priority down"
                    >
                      ▼
                    </button>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => removeFile(file.id)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 ml-2 rounded-md transition-colors"
                      title="Remove file"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
