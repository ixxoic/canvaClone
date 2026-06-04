"use client";

import { LayoutTemplate, ImageIcon, Pencil, Presentation, Settings, Shapes, Sparkles, Type } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { ActiveTool } from "../types";

interface SidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const Sidebar = ({
  activeTool,
  onChangeActiveTool,
}: SidebarProps) => {
  return (
    <aside className="flex h-full w-[72px] shrink-0 flex-col border-r bg-white overflow-y-auto">
      <ul className="flex flex-col gap-0.5 p-2">
        <SidebarItem
          icon={LayoutTemplate}
          label="创建"
          isActive={activeTool === "templates"}
          onClick={() => onChangeActiveTool("templates")}>
        </SidebarItem>
        <SidebarItem
          icon={ImageIcon}
          label="图片"
          isActive={activeTool === "images"}
          onClick={() => onChangeActiveTool("images")}>
        </SidebarItem>
        <SidebarItem
          icon={Type}
          label="文字"
          isActive={activeTool === "text"}
          onClick={() => onChangeActiveTool("text")}>
        </SidebarItem>
        <SidebarItem
          icon={Shapes}
          label="形状"
          isActive={activeTool === "shapes"}
          onClick={() => onChangeActiveTool("shapes")}>
        </SidebarItem>
        <SidebarItem
          icon={Pencil}
          label="绘图"
          isActive={activeTool === "draw"}
          onClick={() => onChangeActiveTool("draw")}>
        </SidebarItem>
        <SidebarItem
          icon={Sparkles}
          label="AI"
          isActive={activeTool === "ai"}
          onClick={() => onChangeActiveTool("ai")}>
        </SidebarItem>
        <SidebarItem
          icon={Settings}
          label="设置"
          isActive={activeTool === "settings"}
          onClick={() => onChangeActiveTool("settings")}>
        </SidebarItem>
      </ul>
    </aside>
  )
}