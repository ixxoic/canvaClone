import { EditorLoader } from "@/features/editor/components/editor-loader";

import { protectServer } from "@/features/auth/utils";

const EditorProjectPage = async () => {
  await protectServer();

  return <EditorLoader />;
};

export default EditorProjectPage;
