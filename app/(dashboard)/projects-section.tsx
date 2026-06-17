"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useDeleteProject } from "@/features/projects/api/use-delete-project";
import { useConfirm } from "@/hooks/use-confirm";
import { useDuplicateProject } from "@/features/projects/api/use-duplicate-project";

import {
  Table,
  TableRow,
  TableBody,
  TableCell
} from "@/components/ui/table";
import {
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { AlertTriangle, CopyIcon, FileIcon, Loader, MoreHorizontal, Search, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

const getRelativeTime = (date: string | number | Date) => {
  const targetTime = new Date(date).getTime();

  if (Number.isNaN(targetTime)) {
    return "未知时间";
  }

  const diffInSeconds = Math.round((targetTime - Date.now()) / 1000);
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["week", 60 * 60 * 24 * 7],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
    ["second", 1],
  ];

  const formatter = new Intl.RelativeTimeFormat("zh-CN", {
    numeric: "auto",
  });

  for (const [unit, secondsInUnit] of units) {
    if (Math.abs(diffInSeconds) >= secondsInUnit || unit === "second") {
      return formatter.format(Math.round(diffInSeconds / secondsInUnit), unit);
    }
  }

  return "未知时间";
}

export const ProjectsSection = () => {
  const [ConfirmDialog, confirm] = useConfirm(
    "你确定吗？",
    "你将删除这个项目",
  );

  const duplicateMutation = useDuplicateProject();
  const removeMutation = useDeleteProject();

  const onCopy = (id: string) => {
    duplicateMutation.mutate({ id });
  }

  const onDelete = async (id: string) => {
    const ok = await confirm();

    if (ok) {
      removeMutation.mutate({ id })
    }
  }

  const router = useRouter();

  const {
    data,
    status,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage
  } = useGetProjects();

  if (status === "pending") {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">
          最近的项目
        </h3>
        <div className="flex flex-col gap-y-4 items-center justify-center h-32">
          <Loader className="size-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">
          最近的项目
        </h3>
        <div className="flex flex-col gap-y-4 items-center justify-center h-32">
          <AlertTriangle className="size-6 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">
            加载项目失败
          </p>
        </div>
      </div>
    )
  }

  if (
    !data.pages.length ||
    !data.pages[0].data.length
  ) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">
          最近的项目
        </h3>
        <div className="flex flex-col gap-y-4 items-center justify-center h-32">
          <Search className="size-6 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">
            未找到项目
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <ConfirmDialog />
      <h3 className="font-semibold text-lg">
        最近的项目
      </h3>
      <Table>
        <TableBody>
          {data.pages.map((group, i) => (
            <React.Fragment key={i}>
              {group.data.map((project) => (
                <TableRow key={project.id}>
                  <TableCell
                    onClick={() => router.push(`/editor/${project.id}`)}
                    className="font-medium flex items-center gap-x-2 cursor-pointer"
                  >
                    <FileIcon className="size-6" />
                    {project.name}
                  </TableCell>
                  <TableCell
                    onClick={() => router.push(`/editor/${project.id}`)}
                    className="max-md:hidden table-cell cursor-pointer"
                  >
                    {project.width} x {project.height} px
                  </TableCell>
                  <TableCell
                    onClick={() => router.push(`/editor/${project.id}`)}
                    className="max-md:hidden table-cell cursor-pointer"
                  >
                    {getRelativeTime(project.updatedAt)}
                  </TableCell>
                  <TableCell className="flex items-center justify-end">
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          disabled={false}
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-60">
                        <DropdownMenuItem
                          className="h-10 cursor-pointer"
                          disabled={duplicateMutation.isPending}
                          onClick={() => onCopy(project.id)}
                        >
                          <CopyIcon className="size-4 mr-2" />
                          复制一份
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="h-10 cursor-pointer"
                          disabled={removeMutation.isPending}
                          onClick={() => onDelete(project.id)}
                        >
                          <Trash className="size-4 mr-2" />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      {hasNextPage && (
        <div className="w-full flex items-center justify-center pt-4">
          <Button
            variant="ghost"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            加载更多
          </Button>
        </div>
      )}
    </div>
  )
}
