//点击AI展开的侧边栏
import Image from "next/image";

import { ActiveTool, Editor } from "../types";
import { cn } from "@/lib/utils";

import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ToolSidebarClose } from "./tool-sidebar-close";
import { useRemoveBg } from "@/features/images/api/use-remove-bg";
import { AlertTriangle } from "lucide-react";

interface RemoveBgSidebarProps {
  editor: Editor | undefined;  //TODO
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
};

export const RemoveBgSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool
}: RemoveBgSidebarProps) => {
  const { shouldBlock, triggerPaywall } = usePaywall();

  const mutation = useRemoveBg();
  //获取选中的对象
  const selectedObject = editor?.selectedObjects[0];

  //获取图片源
  const imageSrc = selectedObject?.type === "image"
    ? selectedObject.toDataURL({ format: "png" })
    : undefined;

  const onClose = () => {
    onChangeActiveTool("select")
  }

  const onClick = () => {
    if (!imageSrc) {
      return;
    }

    if (shouldBlock) {
      triggerPaywall();
      return;
    }

    mutation.mutate({
      image: imageSrc,
    }, {
      onSuccess: (data) => {
        if ("url" in data) {
          editor?.addImage(data.url);
        }
      }
    })

  }

  return (
    <aside
      className={cn("bg-white relative border-r z-40 w-[360px] h-full flex flex-col",
        activeTool === "remove-bg" ? "visible" : "hidden",
      )}>
      <ToolSidebarHeader
        title="背景移除"
        description="使用AI移除图片中的背景"
      />
      {!imageSrc && (
        <div className="flex flex-col gap-y-4 items-center justify-center flex-1">
          <AlertTriangle className="size-4 text-muted-foreground" />
          <p className="text-muted-foreground text-xs">
            功能不可用于该对象
          </p>
        </div>
      )}
      {imageSrc && (
        <ScrollArea>
          <div className="p-6">
            <div className="mx-auto max-w-[260px] space-y-4">
              <div className={cn(
                "relative aspect-square rounded-md overflow-hidden transition bg-muted",
                mutation.isPending && "opacity-50",
              )}>
                <Image
                  src={imageSrc}
                  fill
                  alt="Image"
                  className="object-cover"
                />
              </div>
              <Button
                onClick={onClick}
                disabled={mutation.isPending}
                className="w-full"
              >
                {mutation.isPending ? "正在移除背景..." : "移除背景"}
              </Button>
            </div>
          </div>
        </ScrollArea>
      )}
      <ToolSidebarClose onClick={onClose} />
    </aside>
  )
}
