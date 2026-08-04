"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Upload, ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ABOUT_IMAGE_LIMIT,
  ABOUT_IMAGE_MAX_BYTES,
  ABOUT_IMAGE_TYPES,
} from "@/lib/about-images";
import type { AboutImage } from "@/types/about-image";
import ImageDropzone from "@/components/admin/ImageDropzone";
import PendingFileCard from "@/components/admin/PendingFileCard";

type PendingFile = {
  key: string;
  file: File;
  altText: string;
};

// Penjaga tipe tanpa type assertion buta: pastikan nilai adalah AboutImage.
function isAboutImage(value: unknown): value is AboutImage {
  if (typeof value !== "object" || value === null) return false;
  return (
    "id" in value &&
    typeof value.id === "string" &&
    "storage_path" in value &&
    typeof value.storage_path === "string" &&
    "alt_text" in value &&
    typeof value.alt_text === "string" &&
    "sort_order" in value &&
    typeof value.sort_order === "number" &&
    "created_at" in value &&
    typeof value.created_at === "string" &&
    "url" in value &&
    typeof value.url === "string"
  );
}

// Memvalidasi array AboutImage dari respons API; null bila bentuk tidak sesuai.
function parseAboutImages(value: unknown): AboutImage[] | null {
  if (!Array.isArray(value)) return null;
  const result: AboutImage[] = [];
  for (const item of value) {
    if (!isAboutImage(item)) return null;
    result.push(item);
  }
  return result;
}

// Kartu manajemen galeri About: unggah, susun urutan, dan hapus gambar
export default function AboutGalleryManager() {
  const [images, setImages] = useState<AboutImage[]>([]);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/admin/about-images")
      .then((r) => r.json())
      .then((d) => {
        const parsed = parseAboutImages(d?.data);
        if (!d?.success || !parsed) {
          setMessage({ type: "error", text: "Gagal memuat galeri" });
          return;
        }
        setImages(parsed);
      })
      .catch(() => setMessage({ type: "error", text: "Gagal memuat galeri" }))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    return () => {
      if (progressTimer.current !== null) clearInterval(progressTimer.current);
    };
  }, []);

  function handleFilesSelected(files: File[]) {
    const validTypes = new Set<string>(ABOUT_IMAGE_TYPES);
    const sisa = Math.max(
      0,
      ABOUT_IMAGE_LIMIT - images.length - pendingFiles.length,
    );

    const invalid = files.filter(
      (file) => !validTypes.has(file.type) || file.size > ABOUT_IMAGE_MAX_BYTES,
    );
    if (invalid.length > 0) {
      setMessage({
        type: "error",
        text: "Hanya gambar JPG, PNG, atau WebP dengan maksimal 5MB yang dapat diunggah",
      });
    }

    const acceptable = files.filter(
      (file) => validTypes.has(file.type) && file.size <= ABOUT_IMAGE_MAX_BYTES,
    );
    const accepted = acceptable.slice(0, sisa);

    if (accepted.length === 0) return;

    if (acceptable.length > sisa) {
      setMessage({
        type: "error",
        text: `Hanya ${sisa} gambar yang dapat ditambahkan`,
      });
    }

    setPendingFiles((prev) => [
      ...prev,
      ...accepted.map((file) => ({
        key: crypto.randomUUID(),
        file,
        altText: "",
      })),
    ]);
  }

  function updatePendingAlt(key: string, altText: string) {
    setPendingFiles((prev) =>
      prev.map((p) => (p.key === key ? { ...p, altText } : p)),
    );
  }

  function removePending(key: string) {
    setPendingFiles((prev) => prev.filter((pending) => pending.key !== key));
  }

  async function handleUpload() {
    if (pendingFiles.length === 0 || uploading) return;
    setUploading(true);
    setMessage(null);
    setProgress(0);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev === null) return prev;
        const next = prev + 5 + Math.random() * 10;
        return next >= 95 ? 95 : next;
      });
    }, 300);
    progressTimer.current = timer;

    try {
      const formData = new FormData();
      for (const pending of pendingFiles) {
        formData.append("files", pending.file);
        formData.append("alt_texts", pending.altText.trim());
      }

      const res = await fetch("/api/admin/about-images", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();

      if (!res.ok || !json?.success) {
        clearInterval(timer);
        progressTimer.current = null;
        setProgress(null);
        setMessage({
          type: "error",
          text: json?.message || "Gagal mengunggah gambar",
        });
        return;
      }

      const parsed = parseAboutImages(json?.data);
      if (!parsed) {
        clearInterval(timer);
        progressTimer.current = null;
        setProgress(null);
        setMessage({ type: "error", text: "Gagal mengunggah gambar" });
        return;
      }

      clearInterval(timer);
      progressTimer.current = null;
      setImages((prev) => [...prev, ...parsed]);
      setPendingFiles([]);
      setProgress(100);
      setTimeout(() => setProgress(null), 400);
      setMessage({
        type: "success",
        text: json?.message || "Gambar galeri berhasil diunggah",
      });
    } catch {
      clearInterval(timer);
      progressTimer.current = null;
      setProgress(null);
      setMessage({ type: "error", text: "Gagal mengunggah gambar" });
    } finally {
      setUploading(false);
    }
  }

  async function handleReorder(index: number, direction: 1 | -1) {
    if (busyId !== null) return;
    const target = index + direction;
    if (target < 0 || target >= images.length) return;

    const image = images[index];
    setBusyId(image.id);
    setMessage(null);

    const snapshot = images;
    const nextImages = [...images];
    [nextImages[index], nextImages[target]] = [
      nextImages[target],
      nextImages[index],
    ];
    setImages(nextImages);

    try {
      const res = await fetch("/api/admin/about-images/order", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: nextImages.map((item) => item.id) }),
      });
      const json = await res.json();

      if (!res.ok || !json?.success) {
        setImages(snapshot);
        setMessage({
          type: "error",
          text: json?.message || "Gagal menyimpan urutan",
        });
        return;
      }

      setMessage({
        type: "success",
        text: json?.message || "Urutan galeri berhasil disimpan",
      });
    } catch {
      setImages(snapshot);
      setMessage({ type: "error", text: "Gagal menyimpan urutan" });
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string) {
    if (busyId !== null) return;
    setBusyId(id);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/about-images/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (!res.ok || !json?.success) {
        setMessage({
          type: "error",
          text: json?.message || "Gagal menghapus gambar",
        });
        return;
      }

      setImages((prev) => prev.filter((image) => image.id !== id));
      setMessage({
        type: "success",
        text: json?.message || "Gambar galeri berhasil dihapus",
      });
    } catch {
      setMessage({ type: "error", text: "Gagal menghapus gambar" });
    } finally {
      setBusyId(null);
    }
  }

  const canUpload =
    pendingFiles.length > 0 &&
    pendingFiles.every((p) => p.altText.trim().length > 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-[#e2e8f0] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] py-12">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-lg border border-[#e2e8f0] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-serif text-lg font-bold text-emerald">
          Input Gambar Poster
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            {images.length}/{ABOUT_IMAGE_LIMIT} gambar
          </span>
        </h2>
      </div>

      {message && (
        <div
          className={`rounded-md px-4 py-3 text-sm ${
            message.type === "success"
              ? "bg-emerald/10 text-emerald"
              : "bg-red-50 text-red-600"
          }`}
        >
          {message.text}
        </div>
      )}

      <ImageDropzone
        onFilesSelected={handleFilesSelected}
        disabled={uploading || images.length >= ABOUT_IMAGE_LIMIT}
      />

      {pendingFiles.length > 0 && (
        <div className="space-y-3">
          {pendingFiles.map((pending, index) => (
            <PendingFileCard
              key={pending.key}
              file={pending.file}
              altText={pending.altText}
              index={index}
              disabled={uploading}
              onAltChange={(value) => updatePendingAlt(pending.key, value)}
              onRemove={() => removePending(pending.key)}
            />
          ))}

          {progress !== null && (
            <div className="space-y-1">
              <div className="h-2 w-full overflow-hidden rounded-full bg-emerald/10">
                <div
                  className="h-full rounded-full bg-emerald transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Mengunggah... {Math.round(progress)}%
              </p>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={uploading || !canUpload}
            className="w-full gap-2 bg-emerald hover:bg-emerald-soft"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Unggah gambar
          </Button>
        </div>
      )}

      {images.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Belum ada gambar yang diunggah
        </p>
      )}

      <ul className="space-y-3">
        {images.map((image, index) => {
          const isBusy = busyId === image.id;
          const isLast = index === images.length - 1;
          return (
            <li
              key={image.id}
              className="flex items-center gap-4 rounded-md border border-[#e2e8f0] p-3"
            >
              <img
                src={image.url}
                alt={image.alt_text}
                className="h-16 w-16 shrink-0 rounded-md object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-800">
                  {image.alt_text}
                </p>
                <p className="text-xs text-muted-foreground">
                  Urutan {index + 1}
                </p>
              </div>

              {isBusy ? (
                <Loader2 className="h-5 w-5 shrink-0 animate-spin text-muted-foreground" />
              ) : (
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReorder(index, -1)}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-4 w-4" />
                    Naik
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReorder(index, 1)}
                    disabled={isLast}
                  >
                    <ArrowDown className="h-4 w-4" />
                    Turun
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                        Hapus
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-red-700">
                          Hapus Gambar Galeri?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Gambar ini akan dihapus permanen dari galeri About.
                          Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(image.id)}
                          disabled={isBusy}
                          className="gap-2 bg-red-600 hover:bg-red-700"
                        >
                          {isBusy ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Ya, Hapus"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
