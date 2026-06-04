//点击AI展开的侧边栏
import { useState } from "react";
import { ActiveTool, Editor } from "../types";
import { cn } from "@/lib/utils";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ToolSidebarClose } from "./tool-sidebar-close";
import { useGenerateImage } from "@/features/ai/api/use-generate-image";

interface AiSidebarProps {
  editor: Editor | undefined;  //TODO
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
};

export const AiSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool
}: AiSidebarProps) => {
  const mutation = useGenerateImage();

  const [value, setValue] = useState("");

  const onSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    //TODO: 支付墙

    mutation.mutate({ prompt: value }, {
      onSuccess: (data) => {
        if ("url" in data) {
          editor?.addImage(data.url);
        }
      }
    })
  }

  const onClose = () => {
    onChangeActiveTool("select")
  }

  return (
    <aside
      className={cn("bg-white relative border-r z-40 w-[360px] h-full flex flex-col",
        activeTool === "ai" ? "visible" : "hidden",
      )}>
      <ToolSidebarHeader
        title="AI助手"
        description="使用AI工具生成图像"
      />
      <ScrollArea>
        <form onSubmit={onSubmit} className="p-4 space-y-6">
          <Textarea
            disabled={mutation.isPending}
            placeholder="描述你想要生成的图像..."
            cols={30}
            rows={30}
            required
            minLength={3}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button
            disabled={mutation.isPending}
            type="submit"
            className="w-full"
          >
            生成图像
          </Button>
        </form>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  )
}
