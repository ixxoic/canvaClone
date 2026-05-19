"use client";

import dynamic from "next/dynamic";

export const EditorLoader = dynamic(
  () => import("./editor").then((mod) => mod.Editor),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Loading editor...
      </div>
    ),
  },
);
