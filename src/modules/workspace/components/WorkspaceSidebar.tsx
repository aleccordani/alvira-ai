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
    <aside className="w-72 border-r border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Workspace</h2>

        <button
          onClick={onCreateWorkspace}
          className="rounded-lg bg-black px-3 py-1.5 text-sm text-white"
        >
          + New
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {loading && (
          <p className="text-sm text-gray-500">Loading workspaces...</p>
        )}

        {!loading && workspaces.length === 0 && (
          <p className="text-sm text-gray-500">No workspace yet.</p>
        )}

        {workspaces.map((workspace) => {
          const isActive = activeWorkspace?.id === workspace.id;

          return (
            <button
              key={workspace.id}
              onClick={() => onSelectWorkspace(workspace)}
              className={`w-full rounded-xl border px-3 py-3 text-left text-sm transition ${
                isActive
                  ? "border-purple-500 bg-purple-50 text-purple-700"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="font-medium">{workspace.name}</div>

              {workspace.description && (
                <div className="mt-1 line-clamp-2 text-xs text-gray-500">
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
