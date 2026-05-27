//点击文本文字展开的侧边栏
import { ActiveTool, Editor } from "../types";
import { cn } from "@/lib/utils";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ToolSidebarClose } from "./tool-sidebar-close";


interface TextSidebarProps {
  editor: Editor | undefined;  //TODO
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
};

export const TextSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool
}: TextSidebarProps) => {


  const onClose = () => {
    onChangeActiveTool("select")
  }


  return (
    <aside
      className={cn("bg-white relative border-r z-40 w-[360px] h-full flex flex-col",
        activeTool === "text" ? "visible" : "hidden",
      )}>
      <ToolSidebarHeader
        title="文本"
        description="向画布添加文本"
      />
      <ScrollArea>
        <div className="p-4 space-y-4 border-b">
          <Button
            className="w-full h-12"
            onClick={() => editor?.addText("请输入文本")}
          >
            添加一个文本框
          </Button>
          <Button
            className="w-full h-12"
            variant="secondary"
            size="lg"
            onClick={() => editor?.addText("标题", {
              fontSize: 80,
              fontWeight: 700,
            })}
          >
            <span className="text-2xl font-bold">
              添加一个标题
            </span>
          </Button>
          <Button
            className="w-full h-12"
            variant="secondary"
            size="lg"
            onClick={() => editor?.addText("副标题", {
              fontSize: 44,
              fontWeight: 500,
            })}
          >
            <span className="text-xl font-semibold">
              添加一个副标题
            </span>
          </Button>
          <Button
            className="w-full h-12"
            variant="secondary"
            size="lg"
            onClick={() => editor?.addText("段落", {
              fontSize: 32,
            })}
          >
            添加一个段落
          </Button>
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  )
}