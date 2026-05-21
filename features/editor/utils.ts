import { RGBColor } from "react-color"

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