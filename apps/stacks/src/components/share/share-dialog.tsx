"use client";

import { useMemo, useState } from "react";
import html2canvas from "html2canvas";

type ShareDialogProps = {
  targetId: string;
  twitterText: string;
};

function getShareCaptureUrl(currentHref: string) {
  const url = new URL(currentHref);
  const stackMatch = url.pathname.match(/^(.*)\/stacks\/([^/]+)\/?$/);
  const categoryMatch = url.pathname.match(/^(.*)\/categories\/([^/]+)\/?$/);

  if (stackMatch) {
    url.pathname = `${stackMatch[1]}/share/stack/${stackMatch[2]}`;
    url.search = "";
    return url.toString();
  }

  if (categoryMatch) {
    url.pathname = `${categoryMatch[1]}/share/category/${categoryMatch[2]}`;
    url.search = "";
    return url.toString();
  }

  url.searchParams.set("share", "1");
  return url.toString();
}

async function waitForIframeLoad(frame: HTMLIFrameElement) {
  await new Promise<void>((resolve, reject) => {
    const timeoutId = window.setTimeout(() => reject(new Error("Share page load timeout")), 15000);

    const onLoad = () => {
      window.clearTimeout(timeoutId);
      resolve();
    };

    const onError = () => {
      window.clearTimeout(timeoutId);
      reject(new Error("Unable to load share page"));
    };

    frame.addEventListener("load", onLoad, { once: true });
    frame.addEventListener("error", onError, { once: true });
  });

  const frameDocument = frame.contentDocument;
  if (!frameDocument) {
    throw new Error("Share page document is unavailable");
  }
  frameDocument.documentElement.classList.remove("dark");
  frameDocument.documentElement.style.colorScheme = "light";
  frameDocument.body.classList.remove("dark");

  if (frameDocument.fonts?.ready) {
    await frameDocument.fonts.ready.catch(() => undefined);
  }

  const imagePromises = Array.from(frameDocument.images).map(
    (image) =>
      new Promise<void>((resolve) => {
        if (image.complete) {
          resolve();
          return;
        }

        const timeoutId = window.setTimeout(() => resolve(), 3500);
        const finish = () => resolve();
        image.addEventListener(
          "load",
          () => {
            window.clearTimeout(timeoutId);
            finish();
          },
          { once: true }
        );
        image.addEventListener(
          "error",
          () => {
            window.clearTimeout(timeoutId);
            finish();
          },
          { once: true }
        );
      })
  );

  await Promise.all(imagePromises);

  await new Promise<void>((resolve) => window.setTimeout(resolve, 40));

  return frameDocument;
}

export function ShareDialog({ targetId, twitterText }: ShareDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pngDataUrl, setPngDataUrl] = useState("");
  const [jpgDataUrl, setJpgDataUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const currentUrl = useMemo(
    () => (typeof window !== "undefined" ? window.location.href : ""),
    [open]
  );

  async function captureScreenshot() {
    setLoading(true);
    setError("");
    setPngDataUrl("");
    setJpgDataUrl("");

    try {
      const iframe = document.createElement("iframe");
      iframe.src = getShareCaptureUrl(window.location.href);
      iframe.setAttribute("aria-hidden", "true");
      iframe.style.position = "fixed";
      iframe.style.left = "-20000px";
      iframe.style.top = "0";
      iframe.style.width = "1280px";
      iframe.style.height = "2600px";
      iframe.style.opacity = "1";
      iframe.style.pointerEvents = "none";
      iframe.style.border = "0";
      document.body.appendChild(iframe);

      let canvas: HTMLCanvasElement;
      try {
        const frameDocument = await waitForIframeLoad(iframe);
        const sourceElement = frameDocument.getElementById(targetId) as HTMLElement | null;
        if (!sourceElement) {
          throw new Error("Target content not found");
        }

        const requiredHeight = Math.max(sourceElement.scrollHeight + 200, 1200);
        iframe.style.height = `${requiredHeight}px`;

        const frameWindow = iframe.contentWindow;
        await new Promise<void>((resolve) => {
          if (!frameWindow) {
            resolve();
            return;
          }
          frameWindow.requestAnimationFrame(() => resolve());
        });
        await new Promise<void>((resolve) => {
          if (!frameWindow) {
            resolve();
            return;
          }
          frameWindow.requestAnimationFrame(() => resolve());
        });

        const scale = Math.min(window.devicePixelRatio || 1, 2);
        const screenshotPromise = html2canvas(sourceElement, {
          backgroundColor: "#ffffff",
          useCORS: true,
          foreignObjectRendering: false,
          logging: false,
          scale,
          windowWidth: frameDocument.documentElement.clientWidth,
          windowHeight: frameDocument.documentElement.clientHeight,
          scrollX: 0,
          scrollY: 0,
          imageTimeout: 5000,
          onclone: (clonedDocument) => {
            const clonedTarget = clonedDocument.getElementById(targetId) as HTMLElement | null;
            if (!clonedTarget) {
              return;
            }

            clonedTarget.style.backgroundColor = "#ffffff";
            clonedTarget.style.boxShadow = "none";
            clonedTarget.style.filter = "none";
            clonedTarget.style.opacity = "1";

            const animatedElements = clonedTarget.querySelectorAll("*");
            animatedElements.forEach((node) => {
              const element = node as HTMLElement;
              element.style.animation = "none";
              element.style.transition = "none";
              element.style.filter = "none";
              element.style.backdropFilter = "none";
              element.style.mixBlendMode = "normal";
              element.style.opacity = "1";
            });
          },
        });

        const timeoutPromiseFactory = () =>
          new Promise<never>((_, reject) => {
            window.setTimeout(() => reject(new Error("Screenshot timeout")), 12000);
          });

        canvas = await Promise.race([screenshotPromise, timeoutPromiseFactory()]);
      } finally {
        iframe.remove();
      }

      const flattenedCanvas = document.createElement("canvas");
      flattenedCanvas.width = canvas.width;
      flattenedCanvas.height = canvas.height;
      const context = flattenedCanvas.getContext("2d");
      if (!context) {
        throw new Error("Unable to prepare screenshot canvas");
      }

      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, flattenedCanvas.width, flattenedCanvas.height);
      context.drawImage(canvas, 0, 0);

      setPngDataUrl(flattenedCanvas.toDataURL("image/png"));
      setJpgDataUrl(flattenedCanvas.toDataURL("image/jpeg", 0.98));
    } catch (err) {
      // Keep a useful trace for debugging while preserving user-friendly UI text.
      console.error("Share screenshot generation failed:", err);
      setError("Unable to generate screenshot.");
    } finally {
      setLoading(false);
    }
  }

  function openDialog() {
    setOpen(true);
    setCopied(false);
    setLoading(false);
    setError("");
    setPngDataUrl("");
    setJpgDataUrl("");
  }

  function downloadImage(dataUrl: string, extension: "png" | "jpg") {
    if (!dataUrl) {
      return;
    }

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `share-${targetId}.${extension}`;
    link.click();
  }

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function shareOnTwitter() {
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      currentUrl
    )}&text=${encodeURIComponent(twitterText)}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          void openDialog();
        }}
        className="rounded-[8px] px-2 py-1 text-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-black/5 dark:text-[#f2f4f6] dark:hover:bg-white/10"
      >
        SHARE
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[1000] grid place-items-center bg-black/35 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-[880px] rounded-[12px] bg-white p-4 text-black shadow-xl md:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-serif text-[24px] text-black md:text-[28px]">Share</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close dialog"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#d6d6d6] transition-all duration-200 hover:border-black/30 hover:bg-black/5"
              >
                <span className="material-symbols-rounded text-[28px] leading-none">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.5fr_1fr]">
              <div className="min-h-[220px] rounded-[10px] border border-[#e0e0e0] bg-[#f8f8f8] p-3">
                {loading && <p className="text-[14px] text-black/60">Generating screenshot...</p>}
                {error && <p className="text-[14px] text-[#b42318]">{error}</p>}
                {!loading && !error && (jpgDataUrl || pngDataUrl) && (
                  <img
                    src={pngDataUrl || jpgDataUrl}
                    alt="Profile screenshot"
                    className="max-h-[420px] w-full rounded-[8px] object-contain"
                  />
                )}
                {!loading && !error && !pngDataUrl && !jpgDataUrl && (
                  <div className="flex min-h-[220px] items-center justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        void captureScreenshot();
                      }}
                      className="h-10 rounded-[8px] border border-black px-4 text-[12px] font-bold tracking-[0.05em] text-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-black hover:text-white"
                    >
                      GENERATE SCREENSHOT
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <label className="block space-y-1">
                  <span className="text-[12px] font-bold tracking-[0.05em] text-[#505050]">
                    PROFILE URL
                  </span>
                  <input
                    value={currentUrl}
                    readOnly
                    className="h-10 w-full rounded-[8px] border border-[#d6d6d6] bg-white px-3 text-[13px] text-black/80"
                  />
                </label>

                <button
                  type="button"
                  onClick={copyUrl}
                  className="h-10 w-full rounded-[8px] border border-black px-3 text-[12px] font-bold tracking-[0.05em] text-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-black hover:text-white"
                >
                  {copied ? "COPIED" : "COPY URL"}
                </button>

                <button
                  type="button"
                  onClick={shareOnTwitter}
                  className="h-10 w-full rounded-[8px] bg-black px-3 text-[12px] font-bold tracking-[0.05em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-black/85"
                >
                  SHARE ON TWITTER/X
                </button>

                <div className="pt-2">
                  <p className="mb-2 text-[12px] font-bold tracking-[0.05em] text-[#505050]">
                    SCREENSHOT DOWNLOAD
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => downloadImage(pngDataUrl, "png")}
                      disabled={!pngDataUrl}
                      className="h-10 rounded-[8px] border border-[#d6d6d6] bg-white text-[12px] font-bold tracking-[0.05em] text-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-black/5 disabled:cursor-not-allowed disabled:text-black/30 disabled:opacity-100 disabled:hover:translate-y-0 disabled:hover:bg-white"
                    >
                      PNG
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadImage(jpgDataUrl || pngDataUrl, "jpg")}
                      disabled={!jpgDataUrl && !pngDataUrl}
                      className="h-10 rounded-[8px] border border-[#d6d6d6] bg-white text-[12px] font-bold tracking-[0.05em] text-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-black/5 disabled:cursor-not-allowed disabled:text-black/30 disabled:opacity-100 disabled:hover:translate-y-0 disabled:hover:bg-white"
                    >
                      JPG
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
