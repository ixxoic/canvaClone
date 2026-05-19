import { useCallback } from "react";
import type { EditorCanvas, FabricNamespace } from "@/features/editor/types";

export const useEditor = () => {
  const init = useCallback(
    ({
      initialCanvas,
      initialContainer,
      fabric,
    }: {
      initialCanvas: EditorCanvas;
      initialContainer: HTMLDivElement;
      fabric: FabricNamespace;
    }) => {
      //设置Fabric所有图形对象的全局默认选中样式
      fabric.Object.prototype.set({
        cornerColor: "#FFF",
        cornerStyle: "circle",
        borderColor: "#3b82f6",
        borderScaleFactor: 1.5,
        transparentCorners: false,
        borderOpacityWhenMoving: 1,
        cornerStrokeColor: "#3b82f6",
      });
      //定义中间那块可设计的白色区域
      const initialWorkspace = new fabric.Rect({
        width: 900,
        height: 1200,
        name: "clip",
        fill: "white",
        selectable: false,   //不能被选中、拖动
        hasControls: false,  //不显示缩放控制点
        shadow: new fabric.Shadow({
          color: "rgba(0,0,0,0.8)",
          blur: 5,
        }),
      });

      //1.整个Fabric画布铺满浏览器容器
      initialCanvas.setWidth(initialContainer.offsetWidth);
      initialCanvas.setHeight(initialContainer.offsetHeight);

      //2.把白色矩形加到画布上
      initialCanvas.add(initialWorkspace);
      //3.把矩形居中
      initialCanvas.centerObject(initialWorkspace);
      //4.裁剪：只在矩形内显示/编辑内容，超出部分不显示
      initialCanvas.clipPath = initialWorkspace;
    },
    [],
  );

  return { init };
};
