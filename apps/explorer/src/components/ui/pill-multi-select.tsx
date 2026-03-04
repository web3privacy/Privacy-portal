"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

export type PillMultiSelectOption = {
  value: string;
  label: string;
  iconUrl?: string;
};

export function PillMultiSelect({
  value,
  onChange,
  options,
  placeholder,
  loading,
  className,
  contentClassName,
  ariaLabel,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  options: PillMultiSelectOption[];
  placeholder: string;
  loading?: boolean;
  className?: string;
  contentClassName?: string;
  ariaLabel?: string;
}) {
  const valueSet = new Set(value);
  const selected = options.filter((o) => valueSet.has(o.value));

  const triggerLabel =
    selected.length === 0
      ? placeholder
      : selected.length === 1
        ? selected[0].label
        : `${selected.length} selected`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-[12px] font-bold uppercase tracking-[0.08em] transition-colors",
            loading
              ? "cursor-wait border-black/10 bg-black/5 text-black/55 dark:border-white/10 dark:bg-white/10 dark:text-white/65"
              : "border-black/10 bg-accent text-accent-foreground hover:bg-accent/90 dark:border-white/10",
            className
          )}
          aria-label={ariaLabel ?? placeholder}
          disabled={!!loading}
        >
          <span className="max-w-[180px] truncate">{triggerLabel}</span>
          <Icon name="expand_more" size={18} className="opacity-80" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className={cn(
          "w-[280px] rounded-[12px] border-black/15 bg-white text-black shadow-lg dark:border-white/15 dark:bg-[#151a21] dark:text-[#f2f4f6]",
          contentClassName
        )}
      >
        {options.map((opt) => (
          <DropdownMenuCheckboxItem
            key={opt.value}
            checked={valueSet.has(opt.value)}
            onCheckedChange={(checked) => {
              const next = new Set(valueSet);
              if (checked) next.add(opt.value);
              else next.delete(opt.value);
              onChange(Array.from(next));
            }}
          >
            <span className="flex items-center gap-2">
              {opt.iconUrl ? (
                <Avatar className="size-4">
                  <AvatarImage src={opt.iconUrl} alt="" />
                  <AvatarFallback className="bg-black/5 text-black/70 dark:bg-white/10 dark:text-white/70">
                    {opt.label[0]?.toUpperCase() ?? "?"}
                  </AvatarFallback>
                </Avatar>
              ) : null}
              <span className="truncate">{opt.label}</span>
            </span>
          </DropdownMenuCheckboxItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={value.length === 0}
          onCheckedChange={() => onChange([])}
        >
          Clear
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
