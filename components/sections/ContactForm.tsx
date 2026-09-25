"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { ContactContent } from "@/types/content";

export function ContactForm({ contact }: { contact: ContactContent }) {
  const schema = z.object({
    name: z.string().trim().min(1, contact.validation.name).max(80),
    email: z.string().trim().email(contact.validation.email).max(160),
    message: z.string().trim().min(1, contact.validation.message).max(4000),
  });

  type FormValues = z.infer<typeof schema>;
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setStatus("idle");
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!response.ok) {
      setStatus("error");
      return;
    }
    setStatus("success");
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
      <label className="block text-sm text-stone-600">
        {contact.fields.name}
        <input
          {...register("name")}
          className="mt-1 w-full rounded-2xl border border-stone-200 px-3 py-2 text-stone-900 outline-none focus:border-indigo-400"
        />
      </label>
      {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name.message}</p> : null}
      <label className="mt-4 block text-sm text-stone-600">
        {contact.fields.email}
        <input
          type="email"
          {...register("email")}
          className="mt-1 w-full rounded-2xl border border-stone-200 px-3 py-2 text-stone-900 outline-none focus:border-indigo-400"
        />
      </label>
      {errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email.message}</p> : null}
      <label className="mt-4 block text-sm text-stone-600">
        {contact.fields.message}
        <textarea
          rows={5}
          {...register("message")}
          className="mt-1 w-full rounded-2xl border border-stone-200 px-3 py-2 text-stone-900 outline-none focus:border-indigo-400"
        />
      </label>
      {errors.message ? <p className="mt-1 text-xs text-red-600">{errors.message.message}</p> : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
      >
        {isSubmitting ? contact.fields.sending : contact.fields.submit}
      </button>
      {status === "success" ? <p className="mt-3 text-sm text-emerald-700">{contact.successMessage}</p> : null}
      {status === "error" ? <p className="mt-3 text-sm text-red-600">{contact.errorMessage}</p> : null}
    </form>
  );
}
