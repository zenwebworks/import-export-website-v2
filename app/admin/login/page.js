"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Globe2, Loader2, ShieldCheck } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ErrorNotice, Field } from "@/components/admin/AdminPrimitives";
import { SITE } from "@/lib/site";
import styles from "@/components/admin/admin.module.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const client = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    if (loading) return;
    setError(""); setLoading(true);
    const form = new FormData(event.currentTarget);
    try {
      const result = await signIn("credentials", { email: form.get("email"), password: form.get("password"), redirect: false });
      if (!result || result.error || !result.ok) { setError("Unable to sign in. Check your email and password and try again."); return; }
      client.clear();
      const requested = new URLSearchParams(window.location.search).get("callbackUrl");
      let destination = "/admin";
      if (requested) {
        const url = new URL(requested, window.location.origin);
        if (url.origin === window.location.origin && (url.pathname === "/admin" || url.pathname.startsWith("/admin/")) && url.pathname !== "/admin/login") destination = url.pathname + url.search;
      }
      router.replace(destination); router.refresh();
    } catch { setError("Unable to reach the sign-in service. Please try again."); }
    finally { setLoading(false); }
  }

  return <main className={styles.login}>
    <section className={styles.loginBrand} aria-label="Ramshel Global Trade">
      <Link href="/"><img src="/assets/logo-last.webp" alt={SITE.name} /></Link>
      <div><div className="mb-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-[#e8bb65]"><Globe2 className="h-5 w-5" />Your trade workspace</div><h2>Global connections.<br /><span>Managed with care.</span></h2><p>Manage your catalogue, respond to enquiries, and keep your business moving from one workspace.</p></div>
      <p className="text-xs">RAMSHEL ENTERPRISES PVT LTD<br />Connecting India with the world.</p>
    </section>
    <section className={styles.loginForm}>
      <div>
        <Link href="/" className={styles.loginMobileLogo}><img src="/assets/logo-last.webp" alt={SITE.name} /></Link>
        <p className={styles.eyebrow}>Administration</p><h1>Welcome back.</h1><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Sign in to your Ramshel admin account.</p>
        <form onSubmit={onSubmit}>
          <Field label="Email address"><Input name="email" type="email" autoComplete="username" placeholder="you@company.com" required disabled={loading} /></Field>
          <div className="grid gap-2"><label htmlFor="admin-password" className="text-xs font-semibold text-navy">Password</label><div className="relative"><Input id="admin-password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" required disabled={loading} className="pr-12" /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} className="absolute right-1 top-1 grid h-10 w-10 place-items-center rounded text-muted-foreground focus-visible:outline-2 focus-visible:outline-ocean" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></div>
          <ErrorNotice error={error} />
          <Button type="submit" variant="gold" size="lg" disabled={loading} className="w-full">{loading ? <Loader2 className="animate-spin" /> : <ArrowRight />}{loading ? "Signing in…" : "Sign in to dashboard"}</Button>
        </form>
        <p className="mt-5 flex items-center justify-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="h-4 w-4" />For authorized team members</p>
        <Link href="/" className="mt-10 inline-flex items-center gap-2 text-xs font-semibold text-ocean"><ArrowLeft className="h-3.5 w-3.5" />Back to website</Link>
      </div>
    </section>
  </main>;
}
