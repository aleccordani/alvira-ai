import type { Workspace } from "../types";

interface WorkspaceSidebarProps {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  loading: boolean;
  onSelectWorkspace: (workspace: Workspace) => void;
  onCreateWorkspace: () => void;
}

export default function WorkspaceSidebar({
  workspaces,
  activeWorkspace,
  loading,
  onSelectWorkspace,
  onCreateWorkspace,
}: WorkspaceSidebarProps) {
  return (
    <aside className="w-72 border-r border-purple-950/25 bg-[#0d0e14] p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Workspace</h2>

        <button
          onClick={onCreateWorkspace}
          className="rounded-lg bg-purple-600 px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90"
        >
          + New
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {loading && (
          <p className="text-sm text-[#8b8e99]">Loading workspaces...</p>
        )}

        {!loading && workspaces.length === 0 && (
          <p className="text-sm text-[#8b8e99]">No workspace yet.</p>
        )}

        {workspaces.map((workspace) => {
          const isActive = activeWorkspace?.id === workspace.id;

          return (
            <button
              key={workspace.id}
              onClick={() => onSelectWorkspace(workspace)}
              className={`w-full rounded-xl border px-3 py-3 text-left text-sm transition ${
                isActive
                  ? "border-purple-500/40 bg-purple-950/30 text-white"
                  : "border-purple-950/20 bg-[#16171f] text-[#c5c6c7] hover:bg-[#1a1c27]"
              }`}
            >
              <div className="font-semibold">{workspace.name}</div>

              {workspace.description && (
                <div className="mt-1 line-clamp-2 text-xs text-[#8b8e99]">
                  {workspace.description}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
