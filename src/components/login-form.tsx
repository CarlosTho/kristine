"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, null);

  return (
    <form action={action} className="mt-8 grid gap-4">
      <label className="grid gap-2 text-sm">
        Email
        <input
          name="email"
          type="email"
          autoComplete="username"
          required
          maxLength={120}
          className="field rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-base"
        />
      </label>
      <label className="grid gap-2 text-sm">
        Password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={8}
          maxLength={128}
          placeholder="Supabase Auth password"
          className="field rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-base"
        />
      </label>
      {state && !state.ok ? (
        <p className="text-sm text-[#8f3d34]" role="alert">
          {state.error}
        </p>
      ) : null}
      <button className="btn btn-primary rounded-full px-6 py-3" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
