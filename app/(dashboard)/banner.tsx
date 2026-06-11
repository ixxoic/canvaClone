import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export const Banner = () => {
  return (
    <div className="aspect-[5/1] min-h-[248px] flex gap-x-6 p-6 items-center rounded-xl
    bg-gradient-to-r from-[#2e62cb] via-[#0073ff] to-[#3faff5] text-white">
      <div className="rounded-full size-28 flex items-center justify-center 
      bg-white/50 hidden md:flex">
        <div className="rounded-full size-28 flex items-center justify-center bg-white">
          <Sparkles className="h-20 text-[#0073ff] fill-[#0073ff]" />
        </div>
      </div>
      <div className="flex flex-col gap-y-2">
        <h1 className="text-xl md:text-3xl font-semibold">
          用图像AI可视化你的想法
        </h1>
        <p className="text-xs md:text-sm mb-2">
          瞬间将灵感转化为设计，只需上传图片让AI完成剩下的工作
        </p>
        <Button
          variant="secondary"
          className="w-[160px]"
        >
          开始创作
          <ArrowRight className="size-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}