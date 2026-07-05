import { useState } from "react";

import WorkspaceChat from "./components/WorkspaceChat";
import WorkspaceFiles from "./components/WorkspaceFiles";
import WorkspaceSidebar from "./components/WorkspaceSidebar";
import UploadDocument from "./components/UploadDocument";
import { useWorkspace } from "./hooks/useWorkspace";
import type { Workspace } from "./types";
import CreateWorkspaceModal from "./components/CreateWorkspaceModal";

export default function WorkspacePage() {
  const { workspaces, loading, createWorkspace } = useWorkspace();
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(
    null,
  );

  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <WorkspaceSidebar
        workspaces={workspaces}
        activeWorkspace={activeWorkspace}
        loading={loading}
        onSelectWorkspace={setActiveWorkspace}
        onCreateWorkspace={() => setShowCreateModal(true)}
      />

      <main className="flex flex-1 flex-col">
        <div className="border-b border-gray-200 bg-white px-6 py-4">
          <h1 className="text-xl font-semibold">Workspace AI</h1>

          <p className="text-sm text-gray-500">
            Upload documents and ask AI based on your workspace knowledge.
          </p>
        </div>

        <div className="grid flex-1 grid-cols-[1fr_320px] gap-4 p-4">
          <WorkspaceChat workspace={activeWorkspace} />

          <aside className="space-y-4">
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
