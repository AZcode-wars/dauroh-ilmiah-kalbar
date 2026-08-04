"use client";

import * as React from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FALLBACK_ABOUT_IMAGE } from "@/lib/about-images";
import { cn } from "@/lib/utils";
import type { AboutImage } from "@/types/about-image";

const ZOOM_STEP = 25;
const MAX_ZOOM = 300;
const AUTO_SLIDE_MS = 5000;

type AboutImageGalleryProps = {
  images: AboutImage[];
};

type DragState = {
  pointerId: number;
  startX: number;
  startY: number;
};

export function AboutImageGallery({ images }: AboutImageGalleryProps) {
  const gallery = images.length > 0 ? images : [FALLBACK_ABOUT_IMAGE];
  const hasMultiple = gallery.length > 1;
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [zoom, setZoom] = React.useState(100);
  const [pan, setPan] = React.useState({ x: 0, y: 0 });
  const [slideDirection, setSlideDirection] = React.useState<"next" | "prev">(
    "next",
  );
  const [reducedMotion, setReducedMotion] = React.useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [dragging, setDragging] = React.useState(false);

  const dragState = React.useRef<DragState | null>(null);
  const panAtDragStart = React.useRef({ x: 0, y: 0 });
  const zoomContainerRef = React.useRef<HTMLDivElement | null>(null);

  const active = gallery[activeIndex % gallery.length];
  const isZoomed = zoom > 100;

  const getMaxPan = React.useCallback((zoomValue: number) => {
    const el = zoomContainerRef.current;
    if (!el) return { maxX: 0, maxY: 0 };
    const overflow = zoomValue / 100 - 1;
    return {
      maxX: (el.clientWidth * overflow) / 2,
      maxY: (el.clientHeight * overflow) / 2,
    };
  }, []);

  const clampPan = React.useCallback(
    (x: number, y: number) => {
      const { maxX, maxY } = getMaxPan(zoom);
      return {
        x: Math.max(-maxX, Math.min(maxX, x)),
        y: Math.max(-maxY, Math.min(maxY, y)),
      };
    },
    [zoom, getMaxPan],
  );

  const changeZoom = React.useCallback(
    (delta: number) => {
      const next = Math.min(Math.max(zoom + delta, 100), MAX_ZOOM);
      if (next === zoom) return;
      setZoom(next);
      setPan((current) => clampPan(current.x, current.y));
    },
    [zoom, clampPan],
  );

  const resetView = React.useCallback(() => {
    setZoom(100);
    setPan({ x: 0, y: 0 });
  }, []);

  const selectIndex = React.useCallback(
    (nextIndex: number, direction?: "next" | "prev") => {
      // Arah geser untuk animasi; diset dulu sebelum slide berganti
      if (direction) setSlideDirection(direction);
      setActiveIndex(
        ((nextIndex % gallery.length) + gallery.length) % gallery.length,
      );
      resetView();
    },
    [gallery.length, resetView],
  );

  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => setReducedMotion(query.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      setDialogOpen(open);
      if (!open) resetView();
    },
    [resetView],
  );

  const closeDialog = React.useCallback(() => {
    setDialogOpen(false);
    resetView();
  }, [resetView]);

  React.useEffect(() => {
    if (!hasMultiple || dialogOpen || reducedMotion) return;
    const timer = window.setInterval(() => {
      selectIndex(activeIndex + 1, "next");
    }, AUTO_SLIDE_MS);
    return () => window.clearInterval(timer);
  }, [
    hasMultiple,
    dialogOpen,
    reducedMotion,
    activeIndex,
    gallery.length,
    selectIndex,
  ]);

  React.useEffect(() => {
    if (!dialogOpen || !hasMultiple) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement
      ) {
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        selectIndex(activeIndex - 1, "prev");
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        selectIndex(activeIndex + 1, "next");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dialogOpen, hasMultiple, activeIndex, gallery.length, selectIndex]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    // Tangkap pointer agar geseran tetap terdeteksi walau keluar area
    event.currentTarget.setPointerCapture(event.pointerId);
    dragState.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
    };
    panAtDragStart.current = { ...pan };
    setDragging(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current) return;
    // Saat belum zoom, geser dipakai untuk swipe pindah gambar, bukan pan
    if (zoom <= 100) return;
    setPan(
      clampPan(
        panAtDragStart.current.x + event.clientX - dragState.current.startX,
        panAtDragStart.current.y + event.clientY - dragState.current.startY,
      ),
    );
  };

  const releaseDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const currentDrag = dragState.current;
    if (!currentDrag) return null;
    if (event.currentTarget.hasPointerCapture(currentDrag.pointerId)) {
      event.currentTarget.releasePointerCapture(currentDrag.pointerId);
    }
    dragState.current = null;
    setDragging(false);
    return currentDrag;
  };

  const handlePointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    const currentDrag = releaseDrag(event);
    if (!currentDrag) return;
    // Swipe horizontal yang jelas = pindah gambar tanpa keluar modal
    if (zoom <= 100 && hasMultiple) {
      const dx = event.clientX - currentDrag.startX;
      const dy = event.clientY - currentDrag.startY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) selectIndex(activeIndex + 1, "next");
        else selectIndex(activeIndex - 1, "prev");
      }
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <div className="group relative">
        <div className="relative min-h-105 w-full md:min-h-135">
          <DialogTrigger asChild>
            <button
              type="button"
              aria-label={`Perbesar gambar: ${active.alt_text}`}
              className="absolute inset-0 flex h-full w-full items-center justify-center overflow-hidden rounded-2xl bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2"
            >
              <div
                key={active.id}
                className={cn(
                  "absolute inset-0 motion-reduce:animate-none",
                  slideDirection === "prev"
                    ? "animate-in slide-in-from-left-8 fade-in-0 duration-500 ease-out"
                    : "animate-in slide-in-from-right-8 fade-in-0 duration-500 ease-out",
                )}
              >
                <Image
                  src={active.url}
                  alt={active.alt_text}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  priority={activeIndex === 0}
                  draggable={false}
                  className="object-contain p-2 rounded-2xl"
                />
              </div>
              <span className="pointer-events-none absolute bottom-3 right-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald/80 text-cream opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
                <ZoomIn className="h-5 w-5" />
              </span>
            </button>
          </DialogTrigger>
          <span className="sr-only" data-testid="about-slide-index">
            {activeIndex + 1}
          </span>
        </div>

        {hasMultiple && (
          <>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Gambar sebelumnya"
              onClick={() => selectIndex(activeIndex - 1, "prev")}
              className="pointer-events-none absolute left-3 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full bg-cream/90 text-emerald opacity-0 shadow-md transition-opacity duration-300 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100 focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 hover:bg-cream"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Gambar berikutnya"
              onClick={() => selectIndex(activeIndex + 1, "next")}
              className="pointer-events-none absolute right-3 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full bg-cream/90 text-emerald opacity-0 shadow-md transition-opacity duration-300 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100 focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 hover:bg-cream"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}

        <DialogContent
          hideDefaultClose
          className="flex max-w-none flex-col border-cream/20 bg-emerald/95 p-3 text-cream md:p-6 h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)]"
        >
          <DialogTitle className="text-cream">
            Preview {active.alt_text}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Geser gambar ke kiri atau kanan untuk pindah gambar. Saat diperbesar,
            seret gambar untuk menjelajah dan gunakan tombol Perbesar atau
            Perkecil.
          </DialogDescription>
          <span className="sr-only" data-testid="about-slide-index">
            {activeIndex + 1}
          </span>
          <div
            ref={zoomContainerRef}
            className="relative min-h-0 flex-1 overflow-hidden rounded-xl"
            style={{
              touchAction: isZoomed ? "none" : "pan-y",
              cursor:
                isZoomed || hasMultiple
                  ? dragging
                    ? "grabbing"
                    : "grab"
                  : "default",
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={releaseDrag}
          >
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom / 100})`,
              }}
            >
              <Image
                key={active.id}
                src={active.url}
                alt={active.alt_text}
                fill
                sizes="100vw"
                draggable={false}
                className="object-contain p-1 rounded-2xl"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
            <Button
              type="button"
              variant="outline"
              aria-label="Perkecil"
              disabled={zoom <= 100}
              onClick={() => changeZoom(-ZOOM_STEP)}
              className="h-11 min-h-11 min-w-11 bg-cream text-emerald hover:bg-cream/90 focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2"
            >
              <ZoomOut className="h-5 w-5" />
              Perkecil
            </Button>
            <Button
              type="button"
              variant="outline"
              aria-label="Perbesar"
              disabled={zoom >= MAX_ZOOM}
              onClick={() => changeZoom(ZOOM_STEP)}
              className="h-11 min-h-11 min-w-11 bg-cream text-emerald hover:bg-cream/90 focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2"
            >
              <ZoomIn className="h-5 w-5" />
              Perbesar
            </Button>
            <Button
              type="button"
              variant="outline"
              aria-label="Atur ulang zoom"
              disabled={zoom <= 100}
              onClick={resetView}
              className="h-11 min-h-11 min-w-11 bg-cream text-emerald hover:bg-cream/90 focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2"
            >
              <RotateCcw className="h-5 w-5" />
              Atur ulang zoom
            </Button>
            <Button
              type="button"
              aria-label="Tutup preview"
              onClick={closeDialog}
              className="h-11 min-h-11 min-w-11 bg-gold text-brown hover:bg-gold/90 focus-visible:ring-2 focus-visible:ring-cream focus-visible:ring-offset-2"
            >
              <X className="h-5 w-5" />
              Tutup preview
            </Button>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}
