import { useCallback, useState, useMemo } from "react";
import { fabric } from "fabric";
import { useAutoResize } from "./use-auto-resize";
import { BuildEditorProps, Editor, CIRCLE_OPTIONS, RECTANGLE_OPTIONS, TRIANGLE_OPTIONS, DIAMOND_OPTIONS } from "../types";

const buildEditor = ({
  canvas,
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
    addCircle: () => {
      const object = new fabric.Circle({
        ...CIRCLE_OPTIONS,
      });

      addToCanvas(object);
    },
    addSoftRectangle: () => {
      const object = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
        rx: 50,
        ry: 50,
      });

      addToCanvas(object);
    },
    addRectangle: () => {
      const object = new fabric.Rect({
        ...RECTANGLE_OPTIONS
      });

      addToCanvas(object);
    },
    addTriangle: () => {
      const object = new fabric.Triangle({
        ...TRIANGLE_OPTIONS,
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
        }
      )

      addToCanvas(object);
    },
  };
};

export const useEditor = () => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useAutoResize({ canvas, container });

  //缓存编辑器实例
  const editor = useMemo(() => {
    if (canvas) {
      return buildEditor({
        canvas,
      });   //我们在钩子外面定义了这个buildEditor函数
    }

    return undefined;
  }, [canvas])

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
