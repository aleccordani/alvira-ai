import { useState } from "react";

interface CreateWorkspaceModalProps {
  loading: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string }) => Promise<void>;
}

export default function CreateWorkspaceModal({
  loading,
  onClose,
  onSubmit,
}: CreateWorkspaceModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    await onSubmit({
      name,
      description,
    });

    setName("");
    setDescription("");

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[460px] rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold">Create Workspace</h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Workspace Name
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border p-3 outline-none focus:border-purple-500"
              placeholder="Marketing Docs"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-28 w-full rounded-lg border p-3 outline-none focus:border-purple-500"
              placeholder="Optional..."
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Workspace"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
