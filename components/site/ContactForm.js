"use client";

import { useState } from "react";
import { z } from "zod";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  company: z.string().trim().max(150).optional().or(z.literal("")),
  email: z.string().trim().email("Enter a valid email").max(200),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Please share a few details").max(3000),
});

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const raw = Object.fromEntries(new FormData(form).entries());
    const parsed = schema.safeParse(raw);

    if (!parsed.success) {
      const nextErrors = {};
      parsed.error.issues.forEach((issue) => {
        nextErrors[issue.path[0]] = issue.message;
      });
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setFormError("");
    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to send message");
      setSuccess(true);
      form.reset();
    } catch (error) {
      setFormError(error.message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-card-soft">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gold/15 text-gold">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-xl font-bold text-navy">Message received</h3>
        <p className="mt-2 text-sm text-muted-foreground">A member of our team will reply within one business day.</p>
        <Button className="mt-6" variant="navy" onClick={() => setSuccess(false)}>Send another message</Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name *" error={errors.name}><Input name="name" required autoComplete="name" /></Field>
        <Field label="Company" error={errors.company}><Input name="company" autoComplete="organization" /></Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email *" error={errors.email}><Input name="email" type="email" required autoComplete="email" /></Field>
        <Field label="Phone" error={errors.phone}><Input name="phone" type="tel" autoComplete="tel" /></Field>
      </div>
      <Field label="Message *" error={errors.message}><Textarea name="message" rows={5} required /></Field>
      {formError && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{formError}</p>}
      <Button type="submit" variant="navy" size="lg" disabled={loading} className="w-full sm:w-auto">
        {loading ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : <Send className="h-4.5 w-4.5" />}
        {loading ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}

function Field({ label, children, error }) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs font-semibold uppercase tracking-wider text-navy/80">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
