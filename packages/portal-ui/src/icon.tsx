import * as React from "react";
import { cn } from "./cn";

export type PortalIconName = "menu" | "close";

function childrenFor(name: PortalIconName) {
  switch (name) {
    case "menu":
      return (
        <>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </>
      );
    case "close":
      return (
        <>
          <path d="M6 6l12 12" />
          <path d="M18 6L6 18" />
        </>
      );
    default: {
      const _exhaustive: never = name;
      return _exhaustive;
    }
  }
}

export function PortalIcon({
  name,
  size = 24,
  className,
  title,
}: {
  name: PortalIconName;
  size?: number;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      role={title ? "img" : "presentation"}
      aria-label={title}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {title ? <title>{title}</title> : null}
      {childrenFor(name)}
    </svg>
  );
}

