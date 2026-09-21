import type { ElementType, ReactNode } from "react";

const SHELL =
  "ml-[3.75rem] mr-4 w-[min(1120px,calc(100%-4.75rem))] md:ml-[5.75rem] md:mr-8 md:w-[min(1120px,calc(100%-7.75rem))]";

export function SiteShell({
  as: Tag = "div",
  className = "",
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return <Tag className={`${SHELL} ${className}`}>{children}</Tag>;
}
