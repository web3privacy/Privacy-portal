import * as React from "react";
import { cn } from "@/lib/utils";

export function DetailSection({
  id,
  title,
  rightSlot,
  children,
}: {
  id?: string;
  title: string;
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-end justify-between gap-6">
        <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
          <h2 className="font-serif text-[26px] leading-none text-black md:text-[30px] dark:text-[#f2f4f6]">
            {title}
          </h2>
          {rightSlot ? <div className="pb-0.5">{rightSlot}</div> : null}
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function DetailCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-[18px] border border-black/10 bg-black/[0.02] p-5 dark:border-white/10 dark:bg-white/[0.04]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function ValuePill({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "positive" | "negative";
  className?: string;
}) {
  const base =
    "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em]";
  const toneClass =
    tone === "positive"
      ? "bg-accent text-accent-foreground"
      : tone === "negative"
        ? "bg-[#ef4444] text-white"
        : "bg-black/10 text-black/70 dark:bg-white/10 dark:text-white/70";

  return <span className={cn(base, toneClass, className)}>{children}</span>;
}

export function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="text-[12px] font-bold uppercase tracking-[0.08em] text-black/55 dark:text-white/55">
        {label}
      </div>
      <div className="flex flex-wrap justify-end gap-2">{value}</div>
    </div>
  );
}
