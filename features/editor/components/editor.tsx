"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { fabric } from "fabric";
import { useEditor } from "@/features/editor/hooks/use-editor";
import { Navbar } from "@/features/editor/components/navbar";
import { Sidebar } from "@/features/editor/components/sidebar";
import { Toolbar } from "@/features/editor/components/toolbar";
import { Footer } from "@/features/editor/components/footer";
import { ActiveTool } from "../types";
import { ShapeSidebar } from "./shape-sidebar";

export const Editor = () => {

  const [activeTool, setActiveTool] = useState<ActiveTool>("select");

  //因为待会useEffect会用到onChangeActiveTool函数，所以需要将它记忆化
  const onChangeActiveTool = useCallback((tool: ActiveTool) => {
    // 再次点击同一项 → 收起面板，回到「选择」模式
    if (tool === activeTool) {
      if (activeTool === "draw") {
        // TODO: 禁用绘画模式
      }
      setActiveTool("select");
      return;
    }

    if (tool === "draw") {
      // TODO: 启用绘画模式
    }

    if (activeTool === "draw") {
      // TODO: 禁用绘画模式
    }

    setActiveTool(tool);
  }, [activeTool]);

  const { init } = useEditor();
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
        activeTool={activeTool}
        onChangeActiveTool={onChangeActiveTool}
      />
      <div className="absolute h-[calc(100%-68px)] w-full top-[68px] flex">
        <Sidebar
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}>
        </Sidebar>
        <ShapeSidebar
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}>
        </ShapeSidebar>
        <main className="bg-muted flex-1 overflow-auto relative flex flex-col">
          <Toolbar></Toolbar>
          <div className="h-[calc(100%-124px)] flex-1 bg-muted" ref={containerRef} />
          <Footer />
        </main>
      </div>
    </div>
  );
};
