import Image from "next/image";

import { cn } from "@/lib/utils";
import { Crown } from "lucide-react";

interface TemplateCardProps {
  imageSrc?: string | null;
  title: string;
  onClick: () => void;
  disabled?: boolean;
  description: string;
  width: number;
  height: number;
  isPro: boolean | null;
}

export const TemplateCard = ({
  imageSrc,
  title,
  onClick,
  disabled,
  description,
  height,
  width,
  isPro
}: TemplateCardProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "space-y-2 group text-left transition flex flex-col",
        disabled ? "cursor-not-allowed opacity-75" : "cursor-pointer"
      )}
    >
      <div
        style={{ aspectRatio: `${width}/${height}` }}
        className="relative rounded-xl h-full w-full overflow-hidden border"
      >
        {imageSrc ? (
          <Image
            fill
            src={imageSrc}
            alt={title}
            unoptimized
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted px-3 text-center text-xs text-muted-foreground">
            暂无缩略图
          </div>
        )}
        {isPro && (
          <div className="absolute top-2 right-2 h-10 w-10 flex items-center justify-center bg-black/50 rounded-full -z[10]"
          >
            <Crown className="size-5 fill-yellow-500 text-yellow-500s" />
          </div>
        )}
        <div className="opacity-0 group-hover:opacity-100 transition absolute inset-0
         bg-black/50 flex items-center justify-center rounded-xl backdrop-filter backdrop-blur-sm">
          <p className="text-white font-medium">
            在编辑器中打开
          </p>
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">
          {title}
        </p>
        <p className="text-xs text-muted-foreground opacity-0 group-hover:opacity-75 transition">
          {description}
        </p>
      </div>
    </button>
  )
}
