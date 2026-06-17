"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useGetProject } from "@/features/projects/api/use-get-project";

import { EditorLoader } from "@/features/editor/components/editor-loader";
import { Loader, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

const EditorProjectPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const {
    data,
    isLoading,
    isError,
  } = useGetProject(projectId);

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="h-full flex flex-col gap-y-5 items-center justify-center">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <p className="text-muted-foreground text-sm">
          获取项目失败
        </p>
        <Button asChild variant="secondary">
          <Link href="/">
            返回首页
          </Link>
        </Button>
      </div>
    )
  }

  return <EditorLoader initialData={data} />;
};

export default EditorProjectPage;
