"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PendingFileCardProps = {
  file: File;
  altText: string;
  index: number;
  disabled?: boolean;
  onAltChange: (value: string) => void;
  onRemove: () => void;
};

// Memformat ukuran byte menjadi label yang mudah dibaca.
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Kartu satu file yang menunggu unggah: thumbnail, nama, ukuran, deskripsi, hapus.
export default function PendingFileCard({
  file,
  altText,
  index,
  disabled = false,
  onAltChange,
  onRemove,
}: PendingFileCardProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    // Pola yang benar untuk StrictMode: URL blob dibuat di dalam effect agar
    // dibuat ulang pada re-mount; lint menganggapnya setState-sync di effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="flex items-start gap-3 rounded-md border border-[#e2e8f0] p-3">
      {previewUrl && (
        <img
          src={previewUrl}
          alt={file.name}
          className="h-14 w-14 shrink-0 rounded-md object-cover"
        />
      )}
      <div className="min-w-0 flex-1 space-y-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-gray-800">
            {file.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatFileSize(file.size)}
          </p>
        </div>
        <div className="space-y-1">
          <Label
            htmlFor={`alt-${index}-${file.name}`}
            className="text-xs font-semibold text-gray-700"
          >
            Deskripsi gambar
          </Label>
          <Input
            id={`alt-${index}-${file.name}`}
            type="text"
            value={altText}
            onChange={(e) => onAltChange(e.target.value)}
            placeholder="Tulis deskripsi singkat gambar ini"
            disabled={disabled}
          />
        </div>
      </div>
      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        aria-label={`Hapus ${file.name}`}
        className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
