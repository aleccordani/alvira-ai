import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FileText, Trash2 } from "lucide-react";

import { workspaceService } from "../services/workspace.service";
import type { Workspace } from "../types";
import { formatFileSize } from "../utils";

type Props = {
  workspace: Workspace | null;
};

export default function WorkspaceFiles({ workspace }: Props) {
  const queryClient = useQueryClient();

  const { data = [], isPending } = useQuery({
    queryKey: ["workspace-files", workspace?.id],
    queryFn: () => workspaceService.getWorkspaceFiles(workspace!.id),
    enabled: !!workspace,
  });

  const deleteFile = useMutation({
    mutationFn: (fileId: string) =>
      workspaceService.deleteWorkspaceFile(workspace!.id, fileId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspace-files", workspace?.id],
      });
    },
  });

  return (
    <div className="rounded-xl border bg-white p-4">
      <h3 className="mb-4 font-semibold">Documents</h3>

      {!workspace && (
        <p className="text-sm text-gray-500">Select a workspace first.</p>
      )}

      {workspace && isPending && (
        <p className="text-sm text-gray-500">Loading documents...</p>
      )}

      {workspace && !isPending && data.length === 0 && (
        <p className="text-sm text-gray-500">No documents uploaded yet.</p>
      )}

      <div className="space-y-2">
        {data.map((file) => (
          <div
            key={file.id}
            className="group flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-3 transition hover:border-violet-300 hover:bg-violet-50"
          >
            <FileText className="mt-1 h-5 w-5 shrink-0 text-violet-600" />

            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{file.filename}</p>

              <p className="text-xs text-gray-500">
                {formatFileSize(file.size)}
              </p>
            </div>

            <button
              type="button"
              disabled={deleteFile.isPending}
              onClick={() => {
                const confirmDelete = window.confirm(
                  `Delete "${file.filename}"?`,
                );

                if (!confirmDelete) return;

                deleteFile.mutate(file.id);
              }}
              className="rounded-lg p-2 text-gray-400 opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
              title="Delete document"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
