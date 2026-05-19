/** 编辑器用到的 Canvas 能力，避免在 hook 里 import fabric */

/** Fabric 矩形，用作工作区 / 裁剪路径 */
export type FabricRect = unknown;

export type FabricRectOptions = {
  width?: number;
  height?: number;
  name?: string;
  fill?: string;
  selectable?: boolean;
  hasControls?: boolean;
  shadow?: unknown;
};

/** 全局选中框 / 控制点样式（fabric.Object.prototype.set） */
export type FabricObjectDefaults = {
  cornerColor?: string;
  cornerStyle?: "rect" | "circle";
  borderColor?: string;
  borderScaleFactor?: number;
  transparentCorners?: boolean;
  borderOpacityWhenMoving?: number;
  cornerStrokeColor?: string;
};

/** init 里用到的 Fabric API，由 editor 动态 import 后传入 */
export type FabricNamespace = {
  Object: {
    prototype: {
      set: (options: FabricObjectDefaults) => void;
    };
  };
  Rect: new (options: FabricRectOptions) => FabricRect;
  Shadow: new (options: { color?: string; blur?: number }) => unknown;
};

/** 编辑器用到的 Canvas 能力 */
export type EditorCanvas = {
  dispose: () => void;
  setWidth: (width: number) => void;
  setHeight: (height: number) => void;
  add: (object: FabricRect) => EditorCanvas;
  centerObject: (object: FabricRect) => EditorCanvas;
  clipPath: FabricRect | null | undefined;
};
