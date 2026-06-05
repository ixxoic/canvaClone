import { fabric } from "fabric";
import { useCallback, useRef, useState } from "react";
import { JSON_KEYS } from "../types";

interface useHistoryProps {
  canvas: fabric.Canvas | null;
}

export const useHistory = ({ canvas }: useHistoryProps) => {

  //用于渲染特定的状态，比如判断是否可以撤销或重做
  const [historyIndex, setHistoryIndex] = useState(0);
  //画布的JSON字符串化历史记录
  const canvasHistory = useRef<string[]>([]);
  //防止我们执行撤销和重做时触发保存方法
  const skipSave = useRef(false);

  const canUndo = useCallback(() => {
    return historyIndex > 0;
  }, [historyIndex]);

  const canRedo = useCallback(() => {
    return historyIndex < canvasHistory.current.length - 1;
  }, [historyIndex]);

  //这个带skip参数的保存方法会在我们想直接调用保存方法，但又不想把它添加到撤销或重做操作时使用
  const save = useCallback((skip = false) => {
    if (!canvas) return;

    const currentState = canvas.toJSON(JSON_KEYS);
    const json = JSON.stringify(currentState);

    if (!skip && !skipSave.current) {
      canvasHistory.current.push(json);
      setHistoryIndex(canvasHistory.current.length - 1);
    }

    //TODO：保存回调函数
  }, [canvas]);

  const undo = useCallback(() => {
    if (canUndo()) {
      skipSave.current = true;
      canvas?.clear().renderAll();

      const previousIndex = historyIndex - 1;
      const previousState = JSON.parse(
        canvasHistory.current[previousIndex]
      );

      canvas?.loadFromJSON(previousState, () => {
        canvas.renderAll();
        setHistoryIndex(previousIndex);
        skipSave.current = false;
      });
    }
  }, [canUndo, canvas, historyIndex]);

  const redo = useCallback(() => {
    if (canRedo()) {
      skipSave.current = true;
      canvas?.clear().renderAll();

      const nextIndex = historyIndex + 1;
      const nextState = JSON.parse(
        canvasHistory.current[nextIndex]
      );

      canvas?.loadFromJSON(nextState, () => {
        canvas.renderAll();
        setHistoryIndex(nextIndex);
        skipSave.current = false;
      });
    }
  }, [canRedo, canvas, historyIndex])

  return {
    save,
    canUndo,
    canRedo,
    undo,
    redo,
    setHistoryIndex,
    canvasHistory,
  };
};