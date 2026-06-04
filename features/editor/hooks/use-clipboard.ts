import { useCallback, useRef } from "react";
import { fabric } from "fabric";

interface UseClipboardProps {
  canvas: fabric.Canvas | null;
}

export const useClipboard = ({
  canvas,
}: UseClipboardProps) => {
  const clipboard = useRef<any>(null);

  const copy = useCallback(() => {
    canvas?.getActiveObject()?.clone((cloned: any) => {
      clipboard.current = cloned;
    })
  }, [canvas]);

  const paste = useCallback(() => {
    if (!clipboard.current) return;

    clipboard.current.clone((clonedObj: any) => {
      //丢弃当前活动对象的选中状态，否则粘贴出来的对象会和当前活动对象重叠在一起
      canvas?.discardActiveObject();
      //粘贴出来的对象会比原对象偏移 10px，以示区别
      clonedObj.set({
        left: clonedObj.left + 10,
        top: clonedObj.top + 10,
        evented: true,
      });

      if (clonedObj.type === "activeSelection") {
        clonedObj.canvas = canvas;
        clonedObj.forEachObject((obj: any) => {
          canvas?.add(obj);
        });
        clonedObj.setCoords();
      } else {
        canvas?.add(clonedObj);
      }

      //剪贴板上的内容不会移除，而是会保留
      clipboard.current.top += 10;
      clipboard.current.left += 10;
      canvas?.setActiveObject(clonedObj);
      canvas?.requestRenderAll();
    })
  }, [canvas]);

  return { copy, paste };
}