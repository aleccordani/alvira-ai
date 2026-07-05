import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { CreateWorkspacePayload } from "../types";
import { workspaceService } from "../services/workspace.service";

export function useWorkspace() {
  const queryClient = useQueryClient();

  const workspaceQuery = useQuery({
    queryKey: ["workspaces"],
    queryFn: workspaceService.getWorkspaces,
  });

  const createWorkspace = useMutation({
    mutationFn: (payload: CreateWorkspacePayload) =>
      workspaceService.createWorkspace(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces"],
      });
    },
  });

  return {
    workspaces: workspaceQuery.data ?? [],
    loading: workspaceQuery.isPending,
    error: workspaceQuery.error,

    createWorkspace,
  };
}
