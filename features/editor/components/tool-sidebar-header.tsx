//工具侧边栏头部组件
interface ToolSidebarHeader {
  title: string;
  description?: string;
}

export const ToolSidebarHeader = ({
  title,
  description
}: ToolSidebarHeader) => {
  return (
    <div className="p-4 border-b space-y-1 h-[68px]">
      <p className="text-sm font-medium">
        {title}
      </p>
      {description && (
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  )
}