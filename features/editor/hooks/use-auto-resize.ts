import type { fabric } from "fabric";

type UseAutoResizeProps = {
  canvas: fabric.Canvas | null;
  container: HTMLDivElement | null;
};

export const useAutoResize = ({ canvas, container }: UseAutoResizeProps) => {
  void canvas;
  void container;
};
