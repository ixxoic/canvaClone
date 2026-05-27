import { useCallback, useState, useMemo } from "react";
import { fabric } from "fabric";
import { useAutoResize } from "./use-auto-resize";
import { useCanvasEvents } from "./use-canvas-events";
import {
  BuildEditorProps,
  Editor,
  CIRCLE_OPTIONS,
  RECTANGLE_OPTIONS,
  TRIANGLE_OPTIONS,
  DIAMOND_OPTIONS,
  FILL_COLOR,
  STROKE_COLOR,
  STROKE_WIDTH,
  EditorHookProps,
  STROKE_DASH_ARRAY,
  TEXT_OPTIONS,
} from "../types";
import { isTextType } from "../utils";


const buildEditor = ({
  canvas,
  fillColor,
  setFillColor,
  strokeColor,
  setStrokeColor,
  strokeWidth,
  setStrokeWidth,
  selectedObjects,
  strokeDashArray,
  setStrokeDashArray
}: BuildEditorProps): Editor => {

  //获取工作区
  const getWorkspace = () => {
    return canvas
      .getObjects()
      .find((object) => object.name === "clip");
  };

  const center = (object: fabric.Object) => {
    const workspace = getWorkspace();
    const centerPoint = workspace?.getCenterPoint();   //获取工作区的中心点

    //如果没有中心点，就直接中断这个方法
    if (!centerPoint) return;

    // 原教程: canvas._centerObject(object, centerPoint)（内部 API，需 @ts-expect-error）
    // 改用公开 API，效果相同：把对象中心对齐到工作区中心
    object.setPositionByOrigin(centerPoint, "center", "center");
  };

  const addToCanvas = (object: fabric.Object) => {
    center(object);
    canvas.add(object);
    canvas.setActiveObject(object);
  };

  return {

    addText: (value, options) => {
      const object = new fabric.Textbox(value, {
        ...TEXT_OPTIONS,
        fill: fillColor,
        ...options
      });

      addToCanvas(object);
    },

    getActiveOpacity: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return 1;
      }

      const value = selectedObject.get("opacity") ?? 1;

      return value;
    },
    changeOpacity: (value: number) => {
      canvas.getActiveObjects().forEach((object) => {
        object.set({ opacity: value });
      });
      canvas.renderAll();
    },

    bringForward: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.bringForward(object);
      });

      canvas.renderAll();
      //TODO：处理工作区溢出问题，元素不能移到实际的工作区下面
      const workspace = getWorkspace();
      workspace?.sendToBack();
    },
    sendBackwards: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.sendBackwards(object);
      });
      canvas.renderAll();

      const workspace = getWorkspace();
      workspace?.sendToBack();
    },

    //修改填充颜色
    changeFillColor: (value: string) => {
      setFillColor(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ fill: value });
      });
      canvas.renderAll();
    },

    //修改描边颜色
    changeStrokeColor: (value: string) => {
      setStrokeColor(value);
      canvas.getActiveObjects().forEach((object) => {

        //因为文本类型没有描边，必须要填充值来代替
        if (isTextType(object.type)) {
          object.set({ fill: value });
          return;
        }

        object.set({ stroke: value });
      });
      canvas.renderAll();
    },

    //修改描边
    changeStrokeWidth: (value: number) => {
      setStrokeWidth(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ strokeWidth: value });
      });
      canvas.renderAll();
    },

    changeStrokeDashArray: (value: number[]) => {
      setStrokeDashArray(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ strokeDashArray: value });
      });
      canvas.renderAll();
    },

    addCircle: () => {
      const object = new fabric.Circle({
        ...CIRCLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });

      addToCanvas(object);
    },
    addSoftRectangle: () => {
      const object = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
        rx: 50,
        ry: 50,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });

      addToCanvas(object);
    },
    addRectangle: () => {
      const object = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });

      addToCanvas(object);
    },
    addTriangle: () => {
      const object = new fabric.Triangle({
        ...TRIANGLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });

      addToCanvas(object);
    },
    addInverseTriangle: () => {
      const HEIGHT = TRIANGLE_OPTIONS.height;
      const WIDTH = TRIANGLE_OPTIONS.width;

      const object = new fabric.Polygon(
        [
          { x: 0, y: 0 },
          { x: WIDTH, y: 0 },
          { x: WIDTH / 2, y: HEIGHT },
        ],
        {
          ...TRIANGLE_OPTIONS,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
          strokeDashArray: strokeDashArray,
        }
      )

      addToCanvas(object);
    },
    addDiamond: () => {
      const HEIGHT = DIAMOND_OPTIONS.height;
      const WIDTH = DIAMOND_OPTIONS.width;

      const object = new fabric.Polygon(
        [
          { x: WIDTH / 2, y: 0 },
          { x: WIDTH, y: HEIGHT / 2 },
          { x: WIDTH / 2, y: HEIGHT },
          { x: 0, y: HEIGHT / 2 },
        ],
        {
          ...DIAMOND_OPTIONS,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
          strokeDashArray: strokeDashArray,
        }
      )

      addToCanvas(object);
    },
    canvas,
    getActiveFillColor: () => {
      const selectedObject = selectedObjects[0];

      //如果没有选中对象，那么活动填充颜色只能是我们最后使用的填充颜色
      if (!selectedObject) {
        return fillColor;
      }

      const value = selectedObject.get("fill") || fillColor;

      //目前渐变和图案不受支持，只支持字符串
      return value as string;
    },
    getActiveStrokeColor: () => {
      const selectedObject = selectedObjects[0];

      //如果没有选中对象，那么活动描边颜色只能是我们最后使用的描边颜色
      if (!selectedObject) {
        return strokeColor;
      }

      const value = selectedObject.get("stroke") || strokeColor;

      return value;
    },
    getActiveStrokeWidth: () => {
      const selectedObject = selectedObjects[0];

      //如果没有选中对象，那么活动描边宽度只能是我们最后使用的描边宽度
      if (!selectedObject) {
        return strokeWidth;
      }

      const value = selectedObject.get("strokeWidth") || strokeWidth;

      return value;
    },
    getActiveStrokeDashArray: () => {
      const selectedObject = selectedObjects[0];

      //如果没有选中对象，那么活动描边虚线数组只能是我们最后使用的描边虚线数组
      if (!selectedObject) {
        return strokeDashArray;
      }

      const value = selectedObject.get("strokeDashArray") || strokeDashArray;

      return value;
    },
    selectedObjects,
  };
};

export const useEditor = ({
  clearSelectionCallback
}: EditorHookProps) => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  //存储我们当前选择的对象类型，根据它是图片/文本来选择显示上方工具栏
  const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);

  const [fillColor, setFillColor] = useState(FILL_COLOR);
  const [strokeColor, setStrokeColor] = useState(STROKE_COLOR);
  const [strokeWidth, setStrokeWidth] = useState(STROKE_WIDTH);
  const [strokeDashArray, setStrokeDashArray] = useState<number[]>(STROKE_DASH_ARRAY);

  useAutoResize({ canvas, container });

  useCanvasEvents({
    canvas,
    setSelectedObjects,
    clearSelectionCallback,
  })

  //缓存编辑器实例
  const editor = useMemo(() => {
    if (canvas) {
      return buildEditor({
        canvas,
        fillColor,
        setFillColor,
        strokeColor,
        setStrokeColor,
        strokeWidth,
        setStrokeWidth,
        strokeDashArray,
        setStrokeDashArray,
        selectedObjects,
      });   //我们在钩子外面定义了这个buildEditor函数
    }

    return undefined;
  }, [
    canvas,
    fillColor,
    strokeColor,
    strokeWidth,
    selectedObjects,
    strokeDashArray,
  ]);

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

  return { init, canvas, container, editor };
};
