"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SITE } from "@/lib/site";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });
    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-navy px-4 py-12">
      <div className="w-full max-w-md overflow-hidden rounded-lg border border-white/10 bg-background shadow-elevated">
        <div className="bg-navy px-6 py-5 text-center">
          <img src="/assets/logo.webp" alt={SITE.name} className="mx-auto h-12 w-full max-w-[320px] object-contain" />
        </div>
        <div className="px-8 pt-7 text-center">
          <h1 className="text-2xl font-bold text-navy">Admin Login</h1>
          <p className="mt-1 text-sm text-muted-foreground">Access the {SITE.short} trade console.</p>
        </div>
        <form onSubmit={onSubmit} className="grid gap-5 p-8 pt-7">
          <div className="grid gap-1.5">
            <Label>Email</Label>
            <Input name="email" type="email" autoComplete="username" required />
          </div>
          <div className="grid gap-1.5">
            <Label>Password</Label>
            <Input name="password" type="password" autoComplete="current-password" required />
          </div>
          {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
          <Button type="submit" variant="gold" size="lg" disabled={loading} className="w-full"><LogIn className="h-4 w-4" /> {loading ? "Signing in..." : "Sign in"}</Button>
        </form>
      </div>
    </main>
  );
}