"use client";

import { useEffect, useRef } from "react";
import { useEditor } from "@/features/editor/hooks/use-editor";
import type { EditorCanvas, FabricNamespace } from "@/features/editor/types";

export const Editor = () => {
  const { init } = useEditor();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    let canvas: EditorCanvas | undefined;

    void import("fabric").then(({ fabric }) => {
      const fabricCanvas = new fabric.Canvas(canvasRef.current!, {
        controlsAboveOverlay: true,
        preserveObjectStacking: true,
      });
      canvas = fabricCanvas as EditorCanvas;

      init({
        initialCanvas: fabricCanvas as EditorCanvas,
        initialContainer: containerRef.current!,
        fabric: fabric as unknown as FabricNamespace,
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
}