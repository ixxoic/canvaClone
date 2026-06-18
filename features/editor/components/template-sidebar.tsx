//点击图片展开的侧边栏
import Image from "next/image";
import { Loader, AlertTriangle, Crown } from "lucide-react"
import { ActiveTool, Editor } from "../types";

import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useConfirm } from "@/hooks/use-confirm";

import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ToolSidebarClose } from "./tool-sidebar-close";

import { ResponseType, useGetTemplates } from "@/features/projects/api/use-get-templates";

interface TemplateSidebarProps {
  editor: Editor | undefined;  //TODO
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
};

export const TemplateSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool
}: TemplateSidebarProps) => {
  const { shouldBlock, triggerPaywall } = usePaywall();

  const [ConfirmDialog, confirm] = useConfirm(
    "你确定吗？",
    "你即将用此模板替换当前项目"
  )

  const { data, isLoading, isError } = useGetTemplates({
    limit: "20",
    page: "1",
  });

  const onClose = () => {
    onChangeActiveTool("select")
  }

  const onClick = async (template: ResponseType["data"][0]) => {
    if (template.isPro && shouldBlock) {
      triggerPaywall();
      return;
    }

    const ok = await confirm();

    if (ok) {
      editor?.loadJson(template.json);
    }
  }

  return (
    <aside
      className={cn("bg-white relative border-r z-40 w-[360px] h-full flex flex-col",
        activeTool === "templates" ? "visible" : "hidden",
      )}>
      <ConfirmDialog />
      <ToolSidebarHeader
        title="模板"
        description="从多种模板中选择一个以开始你的创作"
      />
      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <Loader className=" size-4 text-muted-foreground animate-spin" />
        </div>
      )}
      {isError && (
        <div className="flex flex-col gap-y-4 items-center justify-center flex-1">
          <AlertTriangle className=" size-4 text-muted-foreground" />
          <p className="text-muted-foreground text-xs">获取模板失败</p>
        </div>
      )}
      <ScrollArea>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            {data && data.map((template) => {
              return (
                <button
                  style={{ aspectRatio: `${template.width}/${template.height}` }}
                  onClick={() => onClick(template)}
                  key={template.id}
                  className="relative w-full group hover:opacity-75
                transition bg-muted rounded-md overflow-hidden border"
                >
                  {template.thumbnaiUrl ? (
                    <Image
                      fill
                      src={template.thumbnaiUrl}
                      alt={template.name || "Template"}
                      unoptimized
                      sizes="180px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center px-3 text-center text-xs text-muted-foreground">
                      暂无缩略图
                    </div>
                  )}
                  {template.isPro && (
                    <div className="absolute top-2 right-2 size-8 items-center flex justify-center bg-black/50 rounded-full">
                      <Crown className="size-4 fill-yellow-500 text-yellow-500" />
                    </div>
                  )}
                  <div
                    className="opacity-0 group-hover:opacity-100 absolute
                  left-0 bottom-0 w-full text-[10px] truncate text-white p-1 bg-black/50 text-left"
                  >
                    {template.name}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  )
}
