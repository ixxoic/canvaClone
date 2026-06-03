//点击滤镜展开的侧边栏
import { ActiveTool, Editor, filters } from "../types";
import { cn } from "@/lib/utils";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ToolSidebarClose } from "./tool-sidebar-close";


interface FilterSidebarProps {
  editor: Editor | undefined;  //TODO
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
};

export const FilterSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool
}: FilterSidebarProps) => {


  const onClose = () => {
    onChangeActiveTool("select")
  }


  return (
    <aside
      className={cn("bg-white relative border-r z-40 w-[360px] h-full flex flex-col",
        activeTool === "filter" ? "visible" : "hidden",
      )}>
      <ToolSidebarHeader
        title="滤镜"
        description="为选中的图像添加滤镜"
      />
      <ScrollArea>
        <div className="p-4 space-y-1 border-b">
          {filters.map((filter) => (
            <Button
              key={filter}
              variant="secondary"
              size="lg"
              className={"w-full h-16 justify-start text-left"}
              onClick={() => editor?.changeImageFilter(filter)}
            >
              {filter}
            </Button>
          ))}
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  )
}