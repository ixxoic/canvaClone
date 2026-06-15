"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { fabric } from "fabric";
import debounce from "lodash.debounce";

import { useEditor } from "@/features/editor/hooks/use-editor";
import { Navbar } from "@/features/editor/components/navbar";
import { Sidebar } from "@/features/editor/components/sidebar";
import { Toolbar } from "@/features/editor/components/toolbar";
import { Footer } from "@/features/editor/components/footer";
import { ActiveTool, selectionDependentTools } from "../types";
import { ShapeSidebar } from "./shape-sidebar";
import { FillColorSidebar } from "./fill-color-sidebar";
import { StrokeColorSidebar } from "./stroke-color-sidebar";
import { StrokeWidthSidebar } from "./stroke-width-sidebar";
import { OpacitySidebar } from "./opacity-sidebar";
import { TextSidebar } from "./text-sidebar";
import { FontSidebar } from "./font-sidebar";
import { ImageSidebar } from "./image-sidebar";
import { FilterSidebar } from "./filter-sidebar";
import { AiSidebar } from "./ai-sidebar";
import { DrawSidebar } from "./draw-sidebar";
import { SettingsSidebar } from "./settings-sidebar";
import { RemoveBgSidebar } from "./remove-bg-sidebar";

import { ResponseType } from "@/features/images/api/use-get-images";
import { useUpdateProject } from "@/features/projects/api/use-update-project";

interface EditorProps {
  initialData: ResponseType["data"];
}

export const Editor = ({ initialData }: EditorProps) => {
  const mutate = useUpdateProject(initialData.id);

  //防抖的保存方法
  const debouncedSave = useCallback(
    debounce(
      (values: {
        json: string,
        height: number,
        width: number
      }) => {
        mutate(values);
      },
      500
    ), [mutate])

  const [activeTool, setActiveTool] = useState<ActiveTool>("select");

  //定义一个常量函数来处理清除选中状态
  const onClearSelection = useCallback(() => {
    //依赖于选中状态的工具列表中包含了当前激活的工具
    if (selectionDependentTools.includes(activeTool)) {
      setActiveTool("select");
    }

  }, [activeTool]);

  //拿到画布初始化函数和编辑器实例
  const { init, editor } = useEditor({
    defaultState: initialData.json,
    defaultWidth: initialData.width,
    defaultHeight: initialData.height,
    clearSelectionCallback: onClearSelection,
    saveCallback: debouncedSave,
  });

  //因为待会useEffect会用到onChangeActiveTool函数，所以需要将它记忆化
  const onChangeActiveTool = useCallback((tool: ActiveTool) => {
    // 再次点击同一项 → 收起面板，回到「选择」模式

    if (tool === "draw") {
      editor?.enableDrawingMode();
    }

    if (activeTool === "draw") {
      editor?.disableDrawingMode();
    }

    if (tool === activeTool) {
      return setActiveTool("select");
    }

    setActiveTool(tool);
  }, [activeTool, editor]);

  const containerRef = useRef<HTMLDivElement>(null);

  // 组件挂载后执行一次「初始化画布」；卸载或依赖变化时执行 return 里的清理
  useEffect(() => {
    // 取出 JSX 里那个空 div（画布容器）
    const container = containerRef.current;
    if (!container) return;

    // disposed：组件是否已卸载。异步加载慢时，用它在回调里「别再往下干」
    let disposed = false;
    // 保存 Fabric 实例，仅供 cleanup 里 dispose 用
    let fabricCanvas: fabric.Canvas | undefined;

    // 不用 JSX 的 <canvas>，避免 React 和 Fabric 抢同一块 DOM
    const canvasEl = document.createElement("canvas");
    container.appendChild(canvasEl);

    // 动态加载 fabric（体积大），不阻塞首屏；void 表示我们不 await 这个 Promise
    void import("fabric").then(async ({ fabric }) => {
      // 若 effect 已 cleanup（如 Strict Mode 先拆再挂），直接退出
      if (disposed) return;

      const { setupEditor } = await import("@/features/editor/lib/setup-editor");
      if (disposed || !containerRef.current) return;

      // 创建画布、工作区、测试矩形等
      const instance = setupEditor(fabric, canvasEl, containerRef.current);
      // 创建过程中组件被卸载了，立刻销毁刚建的实例，避免泄漏
      if (disposed) {
        instance.dispose();
        return;
      }

      fabricCanvas = instance;
      // 把 canvas / container 交给 useEditor（触发自动缩放等）
      init({
        canvas: instance,
        container: containerRef.current,
      });
    });

    // cleanup：离开页面、依赖变化、或 Strict Mode 模拟卸载时执行
    return () => {
      disposed = true;
      fabricCanvas?.dispose();
      container.replaceChildren(); // 清空容器里所有子节点（含 Fabric 加的 wrapper）
    };
  }, [init]);

  return (
    <div className="h-full flex flex-col">
      <Navbar
        id={initialData.id}
        editor={editor}
        activeTool={activeTool}
        onChangeActiveTool={onChangeActiveTool}
      />
      <div className="absolute h-[calc(100%-68px)] w-full top-[68px] flex">
        <Sidebar
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}>
        </Sidebar>
        <ShapeSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}>
        </ShapeSidebar>
        <FillColorSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <StrokeColorSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <StrokeWidthSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <OpacitySidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <TextSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <FontSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <ImageSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <FilterSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <AiSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <RemoveBgSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <DrawSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <SettingsSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <main className="bg-muted flex-1 overflow-auto relative flex flex-col">
          <Toolbar
            editor={editor}
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
            key={JSON.stringify(editor?.canvas.getActiveObject())}
          >
          </Toolbar>
          <div className="h-[calc(100%-124px)] flex-1 bg-muted" ref={containerRef} />
          <Footer editor={editor} />
        </main>
      </div>
    </div>
  );
};
