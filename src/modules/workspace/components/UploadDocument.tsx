import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { UploadCloud } from "lucide-react";

import type { Workspace } from "../types";
import { workspaceService } from "../services/workspace.service";

type Props = {
  workspace: Workspace | null;
};

export default function UploadDocument({ workspace }: Props) {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    if (!workspace) return;

    try {
      setUploading(true);

      await workspaceService.uploadWorkspaceDocument(workspace.id, file);

      queryClient.invalidateQueries({
        queryKey: ["workspace-files", workspace.id],
      });
    } catch (error) {
      console.error(error);
      alert("Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  return (
    <label className="block cursor-pointer rounded-xl border-2 border-dashed border-violet-300 bg-violet-50 p-8 text-center transition hover:border-violet-500 hover:bg-violet-100">
      <input
        type="file"
        accept="application/pdf"
        className="hidden"
        disabled={!workspace || uploading}
        onChange={(e) => {
          const file = e.target.files?.[0];

          if (file) {
            handleUpload(file);
          }

          e.target.value = "";
        }}
      />

      {uploading ? (
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
      ) : (
        <UploadCloud className="mx-auto mb-3 h-10 w-10 text-violet-600" />
      )}

      <p className="text-sm font-medium text-gray-700">
        {uploading ? "Uploading PDF..." : "Upload PDF"}
      </p>

      <p className="mt-1 text-xs text-gray-500">
        {workspace ? "Click to upload document" : "Select workspace first"}
      </p>
    </label>
  );
}
