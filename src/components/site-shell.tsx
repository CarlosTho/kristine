import type { ElementType, ReactNode } from "react";

const SHELL =
  "box-border mx-auto w-full min-w-0 max-w-[1120px] px-[2.75rem] md:mx-0 md:ml-[5.75rem] md:mr-8 md:w-[min(1120px,calc(100%-7.75rem))] md:max-w-none md:px-0";

export function SiteShell({
  as: Tag = "div",
  className = "",
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return <Tag className={`${SHELL}${className ? ` ${className}` : ""}`}>{children}</Tag>;
}
