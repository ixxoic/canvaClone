import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";   //以安全的方式合并或动态启动/禁用Tailwind CSS类
import { Button } from "@/components/ui/button";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  onClick: () => void;
};

export const SidebarItem = ({
  icon: Icon,
  label,
  isActive,
  onClick,
}: SidebarItemProps) => {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      className={cn(
        "h-auto w-full flex flex-col items-center justify-center gap-1 rounded-md px-2 py-2.5",
        isActive && "bg-muted text-primary [&_span]:text-primary",
      )}
    >
      <Icon className="size-5 stroke-2 shrink-0" />
      <span className="text-[11px] leading-none text-muted-foreground">
        {label}
      </span>
    </Button>
  );
}
