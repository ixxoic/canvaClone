//点击形状展开的侧边栏
import { ActiveTool, Editor, FILL_COLOR } from "../types";
import { cn } from "@/lib/utils";

import { ScrollArea } from "@/components/ui/scroll-area";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ToolSidebarClose } from "./tool-sidebar-close";

import { ColorPicker } from "./color-picker";

interface FillColorSidebarProps {
  editor: Editor | undefined;  //TODO
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
};

export const FillColorSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool
}: FillColorSidebarProps) => {

  const value = editor?.fillColor || FILL_COLOR;

  const onClose = () => {
    onChangeActiveTool("select")
  }

  //拿到传过来的props值，改变填充颜色
  const onChange = (value: string) => {
    editor?.changeFillColor(value);
  };

  return (
    <aside
      className={cn("bg-white relative border-r z-40 w-[360px] h-full flex flex-col",
        activeTool === "fill" ? "visible" : "hidden",
      )}>
      <ToolSidebarHeader
        title="填充颜色"
        description="为你的元素填充颜色"
      />
      <ScrollArea>
        <div className="p-4 space-y-6">
          <ColorPicker
            value={value}
            onChange={onChange}
          />
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  )
}