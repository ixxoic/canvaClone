"use client";

import { useFilePicker } from "use-file-picker";
import { Logo } from "@/features/editor/components/logo";
import { ActiveTool, Editor } from "../types";
import { cn } from "@/lib/utils";
import { ChevronDown, Download, MousePointerClick, Redo2, Undo2 } from "lucide-react";
import { CiFileOn } from "react-icons/ci";
import { BsCloudCheck, BsCloudSlash } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Hint } from "@/components/hint";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserButton } from "@/features/auth/components/user-button";
import { useMutationState } from "@tanstack/react-query";

interface NavbarProps {
  id: string;
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const Navbar = ({
  id,
  editor,
  activeTool,
  onChangeActiveTool
}: NavbarProps) => {
  const data = useMutationState({
    filters: {
      mutationKey: ["project", { id }],
      exact: true,
    },
    select: { mutation } => mutation.state.status,
  });

const currentStatus = data[data.length - 1];

const isError = currentStatus === "error";

const isPending = currentStatus === "pending";

const { openFilePicker } = useFilePicker({
  accept: ".json",
  onFilesSuccessfullySelected: ({ plainFiles }: any) => {
    if (plainFiles && plainFiles.length > 0) {
      const file = plainFiles[0];
      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = () => {
        editor?.loadJson(reader.result as string);
      };
    }
  },
});

return (
  <nav className="w-full flex items-center p-4 h-[68px] gap-x-8
    border-b lg:pl-[34px]">
    <Logo />
    <div className="w-full flex items-center gap-x-1 h-full">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="ghost">
            文件
            <ChevronDown className="size-4 ml-2"></ChevronDown>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-60">
          <DropdownMenuItem
            onClick={() => openFilePicker()}
            className="flex items-center gap-x-2"
          >
            <CiFileOn className="size-8"></CiFileOn>
            <div>
              <p>打开</p>
              <p className="text-xs text-muted-foreground">打开一个JSON文件</p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Separator orientation="vertical" className="mx-2"></Separator>
      <Hint label="选择" side="bottom" sideOffset={10}>
        <Button
          onClick={() => onChangeActiveTool("select")}
          variant="ghost"
          size="icon"
          className={cn(activeTool === "select" && "bg-gray-100")}>
          <MousePointerClick className="size-4" />
        </Button>
      </Hint>
      <Hint label="撤销" side="bottom" sideOffset={10}>
        <Button
          disabled={!editor?.canUndo()}
          onClick={() => editor?.onUndo()}
          variant="ghost"
          size="icon"
        >
          <Undo2 className="size-4" />
        </Button>
      </Hint>
      <Hint label="重做" side="bottom" sideOffset={10}>
        <Button
          disabled={!editor?.canRedo()}
          onClick={() => editor?.onRedo()}
          variant="ghost"
          size="icon"
        >
          <Redo2 className="size-4" />
        </Button>
      </Hint>
      <Separator orientation="vertical" className="mx-2"></Separator>
      {isPending && (
        <div className="flex items-center gap-x-2">
          <Loader className="size-4 animate-spin text-muted-foreground" />
          <div className="text-xs text-muted-foreground">保存中...</div>
        </div>
      )}
      {!isPending && isError && (
        <div className="flex items-center gap-x-2">
          <BsCloudSlash className="size-[20px] text-muted-foreground" />
          <div className="text-xs text-muted-foreground">保存失败</div>
        </div>
      )}
      {!isPending && !isError && (
        <div className="flex items-center gap-x-2">
          <BsCloudCheck className="size-[20px] text-muted-foreground" />
          <div className="text-xs text-muted-foreground">已保存</div>
        </div>
      )}
      <div className="ml-auto flex items-center gap-x-4">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost">
              导出
              <Download className="size-4 ml-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-60">
            <DropdownMenuItem
              className="flex items-center gap-x-2"
              onClick={() => editor?.saveJson()}>
              <CiFileOn className="size-8" />
              <div>
                <p>JSON</p>
                <p className="text-xs text-muted-foreground">便于后续编辑与修改</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-x-2"
              onClick={() => editor?.savePng()}>
              <CiFileOn className="size-8" />
              <div>
                <p>PNG</p>
                <p className="text-xs text-muted-foreground">适用于网络分享</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-x-2"
              onClick={() => editor?.saveJpg()}>
              <CiFileOn className="size-8" />
              <div>
                <p>JPG</p>
                <p className="text-xs text-muted-foreground">适用于打印输出</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-x-2"
              onClick={() => editor?.saveSvg()}>
              <CiFileOn className="size-8" />
              <div>
                <p>SVG</p>
                <p className="text-xs text-muted-foreground">适用于矢量软件编辑</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <UserButton />
      </div>
    </div >
  </nav >
)
}