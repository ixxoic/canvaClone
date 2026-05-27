//点击不透明度展开的侧边栏
import { useEffect, useState, useMemo } from "react";
import { ActiveTool, Editor } from "../types";
import { cn } from "@/lib/utils";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { ToolSidebarHeader } from "./tool-sidebar-header";
import { ToolSidebarClose } from "./tool-sidebar-close";


interface OpacitySidebarProps {
  editor: Editor | undefined;  //TODO
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
};

export const OpacitySidebar = ({
  editor,
  activeTool,
  onChangeActiveTool
}: OpacitySidebarProps) => {

  const initialValue = editor?.getActiveOpacity() || 1;
  const selectedObject = useMemo(() => editor?.selectedObjects?.[0],
    [editor?.selectedObjects]);

  const [opacity, setOpacity] = useState(initialValue);

  //选中另一个元素的时候，保持它自己的不透明度
  useEffect(() => {
    //如果有选中的对象，就设置不透明度
    if (selectedObject) {
      setOpacity(selectedObject.get("opacity") ?? 1)
    }
  }, [selectedObject])

  const onClose = () => {
    onChangeActiveTool("select")
  }

  //拿到传过来的props值，改变不透明度
  const onChange = (value: number) => {
    editor?.changeOpacity(value);
    setOpacity(value);
  }


  return (
    <aside
      className={cn("bg-white relative border-r z-40 w-[360px] h-full flex flex-col",
        activeTool === "opacity" ? "visible" : "hidden",
      )}>
      <ToolSidebarHeader
        title="不透明度"
        description="修改元素的不透明度"
      />
      <ScrollArea>
        <div className="p-4 space-y-4 border-b">
          <Slider
            value={[opacity]}
            onValueChange={(values) => onChange(values[0])}
            max={1}
            min={0}
            step={0.01}
          />
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  )
}