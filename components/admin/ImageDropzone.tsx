"use client";

import { useRef, useState } from "react";
import type { DragEvent, KeyboardEvent } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ABOUT_IMAGE_TYPES } from "@/lib/about-images";

type ImageDropzoneProps = {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
};

// Area dropzone: tarik-dan-letak file atau klik untuk membuka dialog pilih file.
export default function ImageDropzone({
  onFilesSelected,
  disabled = false,
}: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const [dragging, setDragging] = useState(false);

  function handleDragEnter(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (disabled) return;
    dragCounter.current += 1;
    setDragging(true);
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setDragging(false);
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    dragCounter.current = 0;
    setDragging(false);
    if (disabled) return;
    const files = Array.from(e.dataTransfer.files ?? []);
    if (files.length > 0) onFilesSelected(files);
  }

  function openDialog() {
    if (disabled) return;
    inputRef.current?.click();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openDialog();
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target;
    const files = Array.from(input.files ?? []);
    input.value = "";
    if (files.length > 0) onFilesSelected(files);
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Pilih gambar galeri"
      aria-disabled={disabled}
      onClick={openDialog}
      onKeyDown={handleKeyDown}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors",
        dragging
          ? "border-emerald bg-emerald/5"
          : "border-input bg-background hover:border-emerald/60 hover:bg-emerald/5",
        disabled && "cursor-not-allowed opacity-60"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ABOUT_IMAGE_TYPES.join(",")}
        multiple
        className="sr-only"
        onChange={handleInputChange}
        disabled={disabled}
      />
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald/10 text-emerald">
        <Upload className="h-6 w-6" />
      </span>
      <span className="text-sm font-semibold text-gray-800">
        Tarik gambar ke sini
      </span>
      <span className="text-xs text-muted-foreground">
        Format yang disarankan: WebP · Maksimal ukuran: 5MB per gambar
      </span>
      <Button type="button" variant="outline" size="sm" disabled={disabled}>
        Pilih File
      </Button>
    </div>
  );
}
