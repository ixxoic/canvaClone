import type { fabric } from "fabric";

type Fabric = typeof import("fabric").fabric;

export function setupEditor(
  fabric: Fabric,
  canvasEl: HTMLCanvasElement,
  container: HTMLDivElement,
): fabric.Canvas {
  const canvas = new fabric.Canvas(canvasEl, {
    controlsAboveOverlay: true,
    preserveObjectStacking: true,
  });

  fabric.Object.prototype.set({
    cornerColor: "#FFF",
    cornerStyle: "circle",
    borderColor: "#3b82f6",
    borderScaleFactor: 1.5,
    transparentCorners: false,
    borderOpacityWhenMoving: 1,
    cornerStrokeColor: "#3b82f6",
  });

  const initialWorkspace = new fabric.Rect({
    width: 900,
    height: 1200,
    name: "clip",
    fill: "white",
    selectable: false,
    hasControls: false,
    shadow: new fabric.Shadow({
      color: "rgba(0,0,0,0.8)",
      blur: 5,
    }),
  });

  canvas.setWidth(container.offsetWidth);
  canvas.setHeight(container.offsetHeight);
  canvas.add(initialWorkspace);
  canvas.centerObject(initialWorkspace);
  canvas.clipPath = initialWorkspace;

  return canvas;
}
