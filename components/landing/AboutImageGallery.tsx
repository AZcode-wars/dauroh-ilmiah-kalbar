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
  const [reducedMotion, setReducedMotion] = React.useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
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
    [zoom, getMaxPan]
  );

  const changeZoom = React.useCallback(
    (delta: number) => {
      const next = Math.min(Math.max(zoom + delta, 100), MAX_ZOOM);
      if (next === zoom) return;
      setZoom(next);
      setPan((current) => clampPan(current.x, current.y));
    },
    [zoom, clampPan]
  );

  const resetView = React.useCallback(() => {
    setZoom(100);
    setPan({ x: 0, y: 0 });
  }, []);

  const selectIndex = React.useCallback(
    (nextIndex: number) => {
      setActiveIndex(
        ((nextIndex % gallery.length) + gallery.length) % gallery.length
      );
      resetView();
    },
    [gallery.length, resetView]
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
    [resetView]
  );

  const closeDialog = React.useCallback(() => {
    setDialogOpen(false);
    resetView();
  }, [resetView]);

  React.useEffect(() => {
    if (!hasMultiple || dialogOpen || reducedMotion) return;
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % gallery.length);
    }, AUTO_SLIDE_MS);
    return () => window.clearInterval(timer);
  }, [hasMultiple, dialogOpen, reducedMotion, activeIndex, gallery.length]);

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
        selectIndex(activeIndex - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        selectIndex(activeIndex + 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dialogOpen, hasMultiple, activeIndex, gallery.length, selectIndex]);

  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (zoom <= 100) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragState.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
    };
    panAtDragStart.current = { ...pan };
    setDragging(true);
  };

  const handlePointerMove = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (!dragState.current) return;
    setPan(
      clampPan(
        panAtDragStart.current.x + event.clientX - dragState.current.startX,
        panAtDragStart.current.y + event.clientY - dragState.current.startY
      )
    );
  };

  const handlePointerEnd = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (!dragState.current) return;
    if (event.currentTarget.hasPointerCapture(dragState.current.pointerId)) {
      event.currentTarget.releasePointerCapture(dragState.current.pointerId);
    }
    dragState.current = null;
    setDragging(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <div className="relative">
        <div className="relative min-h-[420px] w-full md:min-h-[540px]">
        <DialogTrigger asChild>
          <button
            type="button"
            aria-label={`Perbesar gambar: ${active.alt_text}`}
            className="group absolute inset-0 flex h-full w-full items-center justify-center overflow-hidden rounded-2xl bg-cream-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2"
          >
            <Image
              key={active.id}
              src={active.url}
              alt={active.alt_text}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              priority={activeIndex === 0}
              draggable={false}
              className={cn(
                "object-contain p-2 motion-reduce:transition-none transition-opacity duration-500"
              )}
            />
            <span className="pointer-events-none absolute bottom-3 right-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald/80 text-cream opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
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
            onClick={() => selectIndex(activeIndex - 1)}
            className="absolute left-3 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full bg-cream/90 text-emerald shadow-md focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 hover:bg-cream"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Gambar berikutnya"
            onClick={() => selectIndex(activeIndex + 1)}
            className="absolute right-3 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full bg-cream/90 text-emerald shadow-md focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 hover:bg-cream"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
          <div className="mt-4 flex items-center justify-center gap-1">
            {gallery.map((image, index) => (
              <button
                key={image.id}
                type="button"
                aria-label={`Tampilkan gambar ${index + 1}: ${image.alt_text}`}
                aria-current={index === activeIndex ? "true" : undefined}
                onClick={() => selectIndex(index)}
                className="flex h-11 w-11 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2"
              >
                <span
                  className={cn(
                    "h-3 w-3 rounded-full",
                    index === activeIndex ? "bg-emerald" : "bg-emerald/30"
                  )}
                />
              </button>
            ))}
          </div>
        </>
      )}

      <DialogContent
        hideDefaultClose
        className="flex max-w-none flex-col border-cream/20 bg-emerald/95 p-3 text-cream md:p-6 h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)]"
      >
        <DialogTitle className="text-cream">Preview {active.alt_text}</DialogTitle>
        <DialogDescription className="sr-only">
          Gunakan tombol Perbesar atau Perkecil, atau seret gambar untuk
          menjelajah bagian yang diperbesar.
        </DialogDescription>
        <span className="sr-only" data-testid="about-slide-index">
          {activeIndex + 1}
        </span>
        <div
          ref={zoomContainerRef}
          className="relative min-h-0 flex-1 overflow-hidden rounded-xl"
          style={{
            touchAction: isZoomed ? "none" : "auto",
            cursor: isZoomed ? (dragging ? "grabbing" : "grab") : "default",
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
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
              className="object-contain p-1"
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
