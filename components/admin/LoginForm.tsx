"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { inputClass } from "@/components/admin/admin-ui";
import { loginSchema } from "@/lib/schemas";

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginValues) {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!response.ok) {
      setError("root", { message: "That email or password does not match the admin account." });
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-8 shadow-sm"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Portfolio admin</p>
      <h1 className="mt-2 font-serif text-4xl text-stone-950">Sign in</h1>
      <p className="mt-2 text-sm leading-6 text-stone-600">
        Use the admin email and password to edit the public site.
      </p>
      <label className="mt-6 block">
        <span className="text-sm font-semibold text-stone-950">Email</span>
        <input
          type="email"
          autoComplete="username"
          {...register("email")}
          className={inputClass}
        />
      </label>
      {errors.email ? <p className="mt-1 text-sm font-medium text-red-700">{errors.email.message}</p> : null}
      <label className="mt-4 block">
        <span className="text-sm font-semibold text-stone-950">Password</span>
        <input
          type="password"
          autoComplete="current-password"
          {...register("password")}
          className={inputClass}
        />
      </label>
      {errors.password ? <p className="mt-1 text-sm font-medium text-red-700">{errors.password.message}</p> : null}
      {errors.root ? (
        <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-800">
          {errors.root.message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full rounded-full bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
      >
        {isSubmitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
