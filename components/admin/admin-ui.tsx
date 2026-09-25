export const inputClass =
  "mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus:border-indigo-400";

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm text-stone-600">
      {label}
      {children}
    </label>
  );
}

export function ItemActions({
  onUp,
  onDown,
  onRemove,
}: {
  onUp: () => void;
  onDown: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex gap-2">
      <button type="button" onClick={onUp} className="rounded-full border border-stone-200 px-3 py-1 text-xs">
        Up
      </button>
      <button type="button" onClick={onDown} className="rounded-full border border-stone-200 px-3 py-1 text-xs">
        Down
      </button>
      <button type="button" onClick={onRemove} className="rounded-full border border-red-200 px-3 py-1 text-xs text-red-600">
        Delete
      </button>
    </div>
  );
}

export async function saveContent(file: string, data: unknown): Promise<string | null> {
  const response = await fetch("/api/admin/content", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file, data }),
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    return body?.error ?? "Could not save.";
  }
  return null;
}

export async function uploadFile(file: File): Promise<{ path: string; fileName: string } | { error: string }> {
  const form = new FormData();
  form.set("file", file);
  const response = await fetch("/api/admin/upload", { method: "POST", body: form });
  const body = (await response.json().catch(() => null)) as { path?: string; fileName?: string; error?: string } | null;
  if (!response.ok || !body?.path || !body.fileName) return { error: body?.error ?? "Upload failed." };
  return { path: body.path, fileName: body.fileName };
}
