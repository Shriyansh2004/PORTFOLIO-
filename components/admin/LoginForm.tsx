"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
      setError("root", { message: "Invalid email or password." });
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
      <h1 className="font-serif text-3xl text-stone-900">Admin</h1>
      <p className="mt-2 text-sm text-stone-500">Sign in to edit the portfolio.</p>
      <label className="mt-6 block text-sm text-stone-600">
        Email
        <input type="email" {...register("email")} className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2" />
      </label>
      {errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email.message}</p> : null}
      <label className="mt-4 block text-sm text-stone-600">
        Password
        <input type="password" {...register("password")} className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2" />
      </label>
      {errors.password ? <p className="mt-1 text-xs text-red-600">{errors.password.message}</p> : null}
      {errors.root ? <p className="mt-3 text-sm text-red-600">{errors.root.message}</p> : null}
      <button type="submit" disabled={isSubmitting} className="mt-6 w-full rounded-full bg-indigo-600 py-2.5 text-sm font-medium text-white">
        {isSubmitting ? "Signing in" : "Sign in"}
      </button>
    </form>
  );
}
