import { fabric } from "fabric";
import { useCallback, useEffect } from "react";
import type { fabric as Fabric } from "fabric";

interface UseAutoResizeProps {
  canvas: Fabric.Canvas | null;
  container: HTMLDivElement | null;
}

export const useAutoResize = ({ canvas, container }: UseAutoResizeProps) => {
  //自动缩放函数
  const autoZoom = useCallback(() => {
    if (!canvas || !container) return;

    const width = container.offsetWidth;
    const height = container.offsetHeight;

    canvas.setWidth(width);
    canvas.setHeight(height);

    const center = canvas.getCenter(); //获取中心点

    const zoomRatio = 0.85; //缩放比例

    //获取工作区
    const localWorkspace = canvas
      .getObjects()
      .find((object) => object.name === "clip"); //因为我们在初始化工作区的时候给了它一个名字叫clip

    //如果没有本地工作区，我们就中断这个方法
    if (!localWorkspace) return;

    // 计算「工作区完整放进容器」需要的缩放倍数（@types/fabric 未声明该方法，运行时存在）
    const scale = (
      fabric.util as typeof fabric.util & {
        findScaleToFit: (
          object: fabric.Object,
          size: { width: number; height: number },
        ) => number;
      }
    ).findScaleToFit(localWorkspace, {
      width: width,
      height: height,
    });

    // 再乘 0.85，四周留一点边距，避免白底贴边
    const zoom = zoomRatio * scale;

    // 重置视口矩阵为单位矩阵，再围绕画布中心缩放到 zoom
    canvas.setViewportTransform(fabric.iMatrix.concat());
    canvas.zoomToPoint(new fabric.Point(center.left, center.top), zoom);

    //如果有，我们把工作区也对齐一下
    const workspaceCenter = localWorkspace.getCenterPoint();
    // viewportTransform：控制「缩放 + 平移」，是 6 个数的仿射变换矩阵
    const viewportTransform = canvas.viewportTransform;

    if (
      canvas.width === undefined ||
      canvas.height === undefined ||
      !viewportTransform
    ) {
      return;
    }

    // 复制一份再改，避免直接 mutate 引发 lint；把白底工作区中心挪到画布正中央
    const nextTransform = [...viewportTransform];
    // [4]、[5] 是平移分量 tx、ty；[0]、[3] 与当前缩放有关
    nextTransform[4] = canvas.width / 2 - workspaceCenter.x * nextTransform[0];
    nextTransform[5] = canvas.height / 2 - workspaceCenter.y * nextTransform[3];

    canvas.setViewportTransform(nextTransform);

    // 克隆工作区作为 clipPath，缩放/平移后裁剪区域与视觉一致
    localWorkspace.clone((cloned: fabric.Rect) => {
      canvas.clipPath = cloned;
      canvas.requestRenderAll();   //请下一帧把画布全部重画一遍
    });
  }, [canvas, container]);

  useEffect(() => {
    let resizeObserver: ResizeObserver | null = null;

    if (canvas && container) {
      resizeObserver = new ResizeObserver(() => {
        autoZoom();
      });

      resizeObserver.observe(container);
    }

    //防止内存泄漏
    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [canvas, container, autoZoom]);

  return { autoZoom };
};
