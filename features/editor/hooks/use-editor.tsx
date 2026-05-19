import { useCallback, useState } from "react";
import type { fabric } from "fabric";
import { useAutoResize } from "./use-auto-resize";

export const useEditor = () => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useAutoResize({ canvas, container });

  const init = useCallback(
    ({
      canvas: nextCanvas,   //因为state中已经有同名的变量了，所以这里做个解构同名
      container: nextContainer,
    }: {
      canvas: fabric.Canvas;
      container: HTMLDivElement;
    }) => {
      setCanvas(nextCanvas);
      setContainer(nextContainer);
    },
    [],
  );

  return { init, canvas, container };
};
