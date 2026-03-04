"use client";

import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

/**
 * Shared filter dropdown styled like Stacks - green trigger when unfiltered,
 * white trigger with checkboxes, same panel styling.
 * Use for Jobs, Explorer/Projects filters to match Stacks behavior.
 */
export function FilterDropdown({
  value,
  onChange,
  options,
  placeholder,
  className,
  triggerClassName,
  "aria-label": ariaLabel,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  className?: string;
  triggerClassName?: string;
  "aria-label"?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const label =
    value.length === 0
      ? placeholder
      : value.length === 1
        ? options.find((o) => o.value === value[0])?.label ?? placeholder
        : `${value.length} selected`;

  const isFiltered = value.length > 0;

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "inline-flex h-10 w-full items-center justify-between rounded-[8px] px-3 text-[14px] font-semibold tracking-[0.03em] transition-all duration-200 md:min-w-[180px]",
          isFiltered
            ? "border border-transparent bg-white text-black dark:bg-[#12161d] dark:text-[#f2f4f6]"
            : "bg-[#70FF88] text-black hover:-translate-y-0.5 hover:bg-[#5bee72]",
          triggerClassName
        )}
        aria-label={ariaLabel ?? placeholder}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="truncate">{label}</span>
        <span
          className={cn(
            "material-symbols-rounded text-[18px] leading-none transition-transform duration-150",
            open && "rotate-180"
          )}
        >
          keyboard_arrow_down
        </span>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full z-[220] mt-1 rounded-[10px] border border-[#d9d9d9] bg-white p-2 shadow-[0_12px_24px_rgba(0,0,0,0.14)] dark:border-[#3a3f47] dark:bg-[#11161e] dark:shadow-[0_12px_24px_rgba(0,0,0,0.45)] md:right-auto md:w-[290px]"
        >
          <div className="mb-2 flex items-center justify-between px-1">
            <span className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#5c5c5c] dark:text-[#aab3c1]">
              {placeholder}
            </span>
            {value.length > 0 && (
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-[11px] font-semibold uppercase tracking-[0.05em] text-black/70 transition-colors duration-150 hover:text-black dark:text-[#c6ccd6] dark:hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
          <div className="max-h-[260px] space-y-1 overflow-y-auto pr-1">
            {options.map((opt) => {
              const checked = value.includes(opt.value);
              return (
                <label
                  key={opt.value}
                  role="option"
                  aria-selected={checked}
                  className="flex cursor-pointer items-center gap-2 rounded-[8px] px-2 py-1.5 text-[13px] text-black transition-colors duration-150 hover:bg-black/5 dark:text-[#e2e7ef] dark:hover:bg-white/10"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      const next = checked
                        ? value.filter((v) => v !== opt.value)
                        : [...value, opt.value];
                      onChange(next);
                    }}
                    className="h-4 w-4 rounded border-[#bdbdbd] accent-[#70FF88]"
                  />
                  <span>{opt.label}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
