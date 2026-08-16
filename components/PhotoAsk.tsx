"use client";

import { useRef, useState } from "react";
import { Camera, Image as ImageIcon, Loader2, X } from "lucide-react";
import GuideView from "./GuideView";
import { getCategoryById, type Item } from "@/lib/data";

type Status = "idle" | "loading" | "result" | "error";

const MAX_FILE_BYTES = 20 * 1024 * 1024;
const MAX_DIMENSION = 1568;
const JPEG_QUALITY = 0.85;

async function resizeImage(file: File): Promise<{ base64: string; mediaType: string }> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("file read failed"));
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("image decode failed"));
    image.src = dataUrl;
  });

  const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
  const width = Math.round(img.width * scale);
  const height = Math.round(img.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas context unavailable");
  ctx.drawImage(img, 0, 0, width, height);

  const resizedDataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
  return { base64: resizedDataUrl.slice(resizedDataUrl.indexOf(",") + 1), mediaType: "image/jpeg" };
}

export default function PhotoAsk() {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [item, setItem] = useState<Item | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/") || file.size > MAX_FILE_BYTES) {
      setItem(null);
      setStatus("error");
      return;
    }

    setStatus("loading");
    setItem(null);

    try {
      const { base64, mediaType } = await resizeImage(file);

      const res = await fetch("/api/ask-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: base64, mediaType }),
      });
      const json = await res.json();

      if (json.item) {
        setItem(json.item);
        setStatus("result");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  function close() {
    setStatus("idle");
    setItem(null);
  }

  return (
    <>
      <button
        type="button"
        aria-label="사진 촬영으로 검색"
        onClick={() => cameraInputRef.current?.click()}
        className="flex h-8 w-8 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-bg"
      >
        <Camera className="h-5 w-5" strokeWidth={2} />
      </button>
      <button
        type="button"
        aria-label="사진 첨부로 검색"
        onClick={() => photoInputRef.current?.click()}
        className="flex h-8 w-8 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-bg"
      >
        <ImageIcon className="h-5 w-5" strokeWidth={2} />
      </button>

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        className="hidden"
      />
      <input ref={photoInputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />

      {status !== "idle" && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 py-10 sm:items-center">
          <div className="relative w-full max-w-[600px] rounded-[var(--radius-card)] bg-bg p-6 shadow-[var(--shadow-card-hover)]">
            <button
              type="button"
              aria-label="닫기"
              onClick={close}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-surface text-text-muted shadow-[var(--shadow-card)]"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>

            {status === "loading" && (
              <div className="flex flex-col items-center gap-4 py-16 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-tone-green-fg" strokeWidth={2} />
                <p className="text-base font-bold text-text">사진을 분석하고 있어요</p>
                <p className="text-sm text-text-muted">
                  환경부 등 공식 분리배출 기준을 참고해 답을 준비하고 있어요
                </p>
              </div>
            )}

            {status === "error" && (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <p className="text-base font-bold text-text">사진에서 품목을 알아보지 못했어요</p>
                <p className="text-sm text-text-muted">
                  다른 각도에서 다시 찍거나, 검색창에 직접 입력해보세요
                </p>
              </div>
            )}

            {status === "result" && item && (
              <div className="flex flex-col gap-6 pt-6">
                <p className="text-xs font-semibold text-text-muted">
                  등록된 품목은 아니지만, 환경부 등 공식 분리배출 기준을 참고해 AI가 사진을 분석했어요.
                </p>
                <GuideView key={item.id} item={item} category={getCategoryById(item.categoryId)} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
