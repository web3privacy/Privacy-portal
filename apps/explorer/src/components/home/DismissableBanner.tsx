"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";

const STORAGE_KEY = "w3pn-explorer-hide-banner";

export function DismissableBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      setVisible(v !== "1");
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="mb-8 rounded-[16px] bg-black px-5 py-5 text-white shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="mt-0.5 h-10 w-10 shrink-0 overflow-hidden rounded-full bg-white/10">
            <Image
              src="/web3privacy_eye.webp"
              alt="Web3Privacy"
              width={64}
              height={64}
              className="h-full w-full object-cover opacity-90"
              priority
            />
          </div>
          <div className="max-w-[72ch]">
            <div className="text-[13px] font-bold uppercase tracking-[0.08em] text-white/85">
              Web3Privacy Projects list
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-white/70">
              There are challenges in finding crucial technical details and comparing various
              privacy-focused projects. To address this, we created a platform that standardizes
              and expands the current Web3Privacy ecosystem research.
              <a
                href="https://github.com/web3privacy/explorer-data"
                target="_blank"
                rel="noreferrer"
                className="ml-2 inline-flex items-center gap-1 font-semibold text-white underline underline-offset-4 hover:text-white/90"
              >
                Learn how to contribute
                <span aria-hidden>→</span>
              </a>
            </p>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] text-white/70 hover:bg-white/10 hover:text-white"
          aria-label="Dismiss"
          onClick={() => {
            setVisible(false);
            try {
              localStorage.setItem(STORAGE_KEY, "1");
            } catch {
              // ignore
            }
          }}
        >
          <Icon name="close" size={20} />
        </button>
      </div>
    </div>
  );
}
