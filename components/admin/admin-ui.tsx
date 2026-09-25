"use client";

import { useState } from "react";

export const controlClass =
  "w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-950 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

export const inputClass = `mt-1.5 ${controlClass}`;

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-stone-900">{label}</span>
      {hint ? <span className="mt-0.5 block text-xs leading-5 text-stone-600">{hint}</span> : null}
      {children}
    </label>
  );
}

export function EditorSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 rounded-2xl border border-stone-200 bg-stone-50 p-4 sm:p-5">
      <div>
        <h2 className="text-base font-semibold text-stone-950">{title}</h2>
        {description ? <p className="mt-1 text-sm leading-6 text-stone-600">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function ItemCard({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <article className="space-y-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-stone-950">{title}</h3>
          {subtitle ? <p className="mt-0.5 text-xs text-stone-600">{subtitle}</p> : null}
        </div>
        {actions}
      </div>
      {children}
    </article>
  );
}

const actionButton =
  "rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-800 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40";

export function ItemActions({
  onUp,
  onDown,
  onRemove,
  disableUp,
  disableDown,
}: {
  onUp: () => void;
  onDown: () => void;
  onRemove: () => void;
  disableUp?: boolean;
  disableDown?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={onUp} disabled={disableUp} className={actionButton}>
        Move up
      </button>
      <button type="button" onClick={onDown} disabled={disableDown} className={actionButton}>
        Move down
      </button>
      <button
        type="button"
        onClick={onRemove}
        className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100"
      >
        Remove
      </button>
    </div>
  );
}

export function AddButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl border border-dashed border-indigo-300 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700 transition hover:border-indigo-400 hover:bg-indigo-50"
    >
      {children}
    </button>
  );
}

export function CheckField({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-stone-300 bg-white px-3 py-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 accent-indigo-600"
      />
      <span>
        <span className="block text-sm font-semibold text-stone-950">{label}</span>
        {hint ? <span className="mt-0.5 block text-xs leading-5 text-stone-600">{hint}</span> : null}
      </span>
    </label>
  );
}

export function Notice({ error, saved }: { error: string; saved: boolean }) {
  if (error) {
    return (
      <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-800">
        {error}
      </p>
    );
  }
  if (saved) {
    return (
      <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
        Saved. The public site will show these changes.
      </p>
    );
  }
  return <p className="text-sm text-stone-600">Changes stay in this form until you save.</p>;
}

export function SaveBar({
  pending,
  error,
  saved,
  onSave,
}: {
  pending: boolean;
  error: string;
  saved: boolean;
  onSave: () => void;
}) {
  return (
    <div className="sticky bottom-4 z-20 flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-3 shadow-lg sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <Notice error={error} saved={saved} />
      </div>
      <button
        type="button"
        onClick={onSave}
        disabled={pending}
        className="shrink-0 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save changes"}
      </button>
    </div>
  );
}

export function ImagePreview({ src, alt }: { src: string; alt: string }) {
  if (!src) {
    return (
      <div className="flex h-28 items-center justify-center rounded-xl border border-dashed border-stone-300 bg-white text-sm text-stone-600">
        No image yet
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className="h-28 max-w-full rounded-xl border border-stone-200 bg-white object-contain p-2" />
  );
}

export function FilePicker({
  label,
  hint,
  accept,
  busy,
  onPick,
}: {
  label: string;
  hint?: string;
  accept: string;
  busy?: boolean;
  onPick: (file: File) => void;
}) {
  return (
    <Field label={label} hint={hint}>
      <input
        type="file"
        accept={accept}
        disabled={busy}
        className="mt-1.5 block w-full cursor-pointer rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-indigo-800"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onPick(file);
          event.target.value = "";
        }}
      />
      {busy ? <span className="mt-1 block text-xs font-medium text-indigo-700">Uploading…</span> : null}
    </Field>
  );
}

export function useUpload(onDone: (result: { path: string; fileName: string }) => void, onError: (message: string) => void) {
  const [busy, setBusy] = useState(false);

  async function pick(file: File) {
    setBusy(true);
    const uploaded = await uploadFile(file);
    setBusy(false);
    if ("error" in uploaded) onError(uploaded.error);
    else onDone(uploaded);
  }

  return { busy, pick };
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
