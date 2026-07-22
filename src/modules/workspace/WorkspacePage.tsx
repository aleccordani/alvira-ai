import { useEffect, useState } from "react";
import { ArrowLeft, Files, MessageSquare } from "lucide-react";

import WorkspaceChat from "./components/WorkspaceChat";
import WorkspaceFiles from "./components/WorkspaceFiles";
import WorkspaceSidebar from "./components/WorkspaceSidebar";
import UploadDocument from "./components/UploadDocument";
import { useWorkspace } from "./hooks/useWorkspace";
import type { Workspace } from "./types";
import CreateWorkspaceModal from "./components/CreateWorkspaceModal";

type MobilePanel = "workspaces" | "chat" | "documents";

export default function WorkspacePage() {
  const { workspaces, loading, createWorkspace } = useWorkspace();

  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(
    null,
  );

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>("workspaces");

  useEffect(() => {
    if (!activeWorkspace && workspaces.length > 0) {
      setActiveWorkspace(workspaces[0]);
    }
  }, [activeWorkspace, workspaces]);

  const handleSelectWorkspace = (workspace: Workspace) => {
    setActiveWorkspace(workspace);
    setMobilePanel("chat");
  };

  return (
    <div className="flex min-h-full w-full min-w-0 bg-[#0b0c10] text-[#c5c6c7]">
      <div className="hidden min-h-0 shrink-0 md:flex">
        <WorkspaceSidebar
          workspaces={workspaces}
          activeWorkspace={activeWorkspace}
          loading={loading}
          onSelectWorkspace={handleSelectWorkspace}
          onCreateWorkspace={() => setShowCreateModal(true)}
        />
      </div>

      <main className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1 flex-col md:hidden">
          {mobilePanel === "workspaces" && (
            <div className="min-h-0 flex-1 overflow-y-auto">
              <WorkspaceSidebar
                workspaces={workspaces}
                activeWorkspace={activeWorkspace}
                loading={loading}
                onSelectWorkspace={handleSelectWorkspace}
                onCreateWorkspace={() => setShowCreateModal(true)}
              />
            </div>
          )}

          {mobilePanel !== "workspaces" && (
            <>
              <div className="flex shrink-0 items-center justify-between gap-3 border-b border-purple-950/25 bg-[#0d0e14] px-4 py-3">
                <button
                  type="button"
                  onClick={() => setMobilePanel("workspaces")}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-purple-900/25 bg-[#15161e] text-[#c5c6c7] transition hover:border-purple-500/40 hover:text-white"
                  aria-label="Back to workspaces"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">
                    {activeWorkspace?.name ?? "Workspace AI"}
                  </p>

                  <p className="truncate text-[11px] text-[#8b8e99]">
                    {mobilePanel === "chat"
                      ? "Workspace Chat"
                      : "Documents & Files"}
                  </p>
                </div>

                <div className="flex items-center rounded-xl border border-purple-900/20 bg-[#12131a] p-1">
                  <button
                    type="button"
                    onClick={() => setMobilePanel("chat")}
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition ${
                      mobilePanel === "chat"
                        ? "bg-purple-600 text-white"
                        : "text-[#8b8e99] hover:text-white"
                    }`}
                    aria-label="Open workspace chat"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setMobilePanel("documents")}
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition ${
                      mobilePanel === "documents"
                        ? "bg-purple-600 text-white"
                        : "text-[#8b8e99] hover:text-white"
                    }`}
                    aria-label="Open workspace documents"
                  >
                    <Files className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="min-h-0 min-w-0 flex-1 overflow-hidden p-3">
                {mobilePanel === "chat" && (
                  <div className="h-full min-h-0 min-w-0">
                    <WorkspaceChat workspace={activeWorkspace} />
                  </div>
                )}

                {mobilePanel === "documents" && (
                  <div className="h-full space-y-4 overflow-y-auto pb-4">
                    <UploadDocument workspace={activeWorkspace} />
                    <WorkspaceFiles workspace={activeWorkspace} />
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="hidden min-h-0 flex-1 grid-cols-[minmax(0,1fr)_320px] gap-4 p-4 md:grid">
          <div className="min-h-0 min-w-0">
            <WorkspaceChat workspace={activeWorkspace} />
          </div>

          <aside className="min-h-0 space-y-4 overflow-y-auto">
            <UploadDocument workspace={activeWorkspace} />
            <WorkspaceFiles workspace={activeWorkspace} />
          </aside>
        </div>
      </main>

      {showCreateModal && (
        <CreateWorkspaceModal
          loading={createWorkspace.isPending}
          onClose={() => setShowCreateModal(false)}
          onSubmit={async (data) => {
            await createWorkspace.mutateAsync(data);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}
