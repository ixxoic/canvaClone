import { fabric } from "fabric";
import { RGBColor } from "react-color"
import { v4 as uuid } from "uuid";

export function transformText(objects: any) {
  if (!objects) return;

  objects.forEach((item: any) => {
    if (item.objects) {
      transformText(item.objects);
    } else {
      item.type === "text" && (item.type === "textbox");
    }
  });
};

export function downloadFile(file: string, type: string) {
  const anchorElement = document.createElement("a");

  anchorElement.href = file;
  anchorElement.download = `${uuid()}.${type}`;
  document.body.appendChild(anchorElement);
  anchorElement.click();
  anchorElement.remove();
}

//判断当前选中的元素是否为文本类型，如果是的话那我们就不能修改描边，修改填充值才合理
export function isTextType(type: string | undefined) {
  return type === "text" || type === "i-text" || type === "textbox"
}

//把rgba对象转换成一个字符串
export function rgbaObjectToString(rgba: RGBColor | "transparent") {
  if (rgba === "transparent") {
    return `rgba(0,0,0,0)`;
  }

  const alpha = rgba.a === undefined ? 1 : rgba.a;

  return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${alpha})`;
}

//创建一个工具函数根据传入的参数生成相应的滤镜
export const createFilter = (value: string) => {
  let effect;

  switch (value) {
    case "grayscale":
      effect = new fabric.Image.filters.Grayscale();
      break;
    case "polaroid":
      //@ts-expect-error Polaroid存在
      effect = new fabric.Image.filters.Polaroid();
      break;
    case "sepia":
      effect = new fabric.Image.filters.Sepia();
      break;
    case "kodachrome":
      //@ts-expect-error Kodachrome存在
      effect = new fabric.Image.filters.Kodachrome();
      break;
    case "contrast":
      effect = new fabric.Image.filters.Contrast({ contrast: 0.3 });
      break;
    case "brightness":
      effect = new fabric.Image.filters.Brightness({ brightness: 0.8 });
      break;
    case "brownie":
      //@ts-expect-error Brownie存在
      effect = new fabric.Image.filters.Brownie();
      break;
    case "vintage":
      //@ts-expect-error Vintage存在
      effect = new fabric.Image.filters.Vintage();
      break;
    case "technicolor":
      //@ts-expect-error Technicolor存在
      effect = new fabric.Image.filters.Technicolor();
      break;
    case "pixellate":
      //@ts-expect-error Pixellate存在
      effect = new fabric.Image.filters.Pixellate();
      break;
    case "invert":
      effect = new fabric.Image.filters.Invert();
      break;
    case "blur":
      effect = new fabric.Image.filters.Blur();
      break;
    case "sharpen":
      effect = new fabric.Image.filters.Convolute({
        matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0],
      });
      break;
    case "emboss":
      effect = new fabric.Image.filters.Convolute({
        matrix: [1, 1, 1, 1, 0.7, -1, -1, -1, -1],
      });
      break;
    case "removecolor":
      //@ts-expect-error RemoveColor存在
      effect = new fabric.Image.filters.RemoveColor({
        threshold: 0.2,
        distance: 0.5
      });
      break;
    case "blackwhite":
      //@ts-expect-error BlackWhite存在
      effect = new fabric.Image.filters.BlackWhite();
      break;
    case "vibrance":
      //@ts-expect-error Vibrance存在
      effect = new fabric.Image.filters.Vibrance({
        vibrance: 1,
      });
      break;
    case "blendcolor":
      effect = new fabric.Image.filters.BlendColor({
        color: "rgba(255,0,0,0.5)",
        mode: "multiply",
      });
      break;
    case "huerotate":
      effect = new fabric.Image.filters.HueRotation({
        rotation: 0.5,
      });
      break;
    case "resize":
      effect = new fabric.Image.filters.Resize();
      break;
    case "gamma":
      //@ts-expect-error Gamma存在
      effect = new fabric.Image.filters.Gamma({
        gamma: [1, 0.5, 2.1],
      });
      break;
    case "saturation":
      effect = new fabric.Image.filters.Saturation({
        saturation: 0.7,
      })
      break;
    default:
      effect = null;
      return;
  }

  return effect;
};
