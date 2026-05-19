"use client";

import { useEffect, useRef } from "react";
import type { fabric } from "fabric";
import { useEditor } from "@/features/editor/hooks/use-editor";

export const Editor = () => {
  const { init } = useEditor();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    let canvas: fabric.Canvas | undefined;

    void import("fabric").then(async ({ fabric }) => {
      const { setupEditor } = await import("@/features/editor/lib/setup-editor");
      const fabricCanvas = setupEditor(
        fabric,
        canvasRef.current!,
        containerRef.current!,
      );
      canvas = fabricCanvas;

      init({
        canvas: fabricCanvas,
        container: containerRef.current!,
      });
    });

    return () => {
      canvas?.dispose();
    };
  }, [init]);

  return (
    <div className="h-full flex flex-col">
      <div className="h-full flex-1 bg-muted" ref={containerRef}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};
