import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { UploadCloud } from "lucide-react";
import { toast } from "sonner";

import type { Workspace } from "../types";
import { workspaceService } from "../services/workspace.service";

type Props = {
  workspace: Workspace | null;
};

export default function UploadDocument({ workspace }: Props) {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    if (!workspace) {
      toast.error("Select workspace first.");
      return;
    }

    try {
      setUploading(true);

      await workspaceService.uploadWorkspaceDocument(workspace.id, file);

      await queryClient.invalidateQueries({
        queryKey: ["workspace-files", workspace.id],
      });

      toast.success("Document uploaded successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload document.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-purple-500/30 bg-purple-950/10 p-8 text-center transition hover:border-purple-500/60 hover:bg-purple-950/20">
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
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
      ) : (
        <UploadCloud className="mx-auto mb-3 h-10 w-10 text-purple-400" />
      )}

      <p className="text-sm font-semibold text-white">
        {uploading ? "Uploading PDF..." : "Upload PDF"}
      </p>

      <p className="mt-1 text-xs text-[#8b8e99]">
        {workspace ? "Click to upload document" : "Select workspace first"}
      </p>
    </label>
  );
}
