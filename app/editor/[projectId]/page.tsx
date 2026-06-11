"use client";

import Link from "next/link";
import { useGetProject } from "@/features/projects/api/use-get-project";

import { EditorLoader } from "@/features/editor/components/editor-loader";
import { Loader, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditorProjectIdPageProps {
  params: {
    projectId: string;
  }
}

const EditorProjectPage = ({
  params,
}: EditorProjectIdPageProps) => {
  const {
    data,
    isLoading,
    isError,
  } = useGetProject(params.projectId);

  if (!isLoading || !data) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (isError) {
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
