"use client";

import { useState } from "react";
import { z } from "zod";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  buyer_name: z.string().trim().min(2, "Enter your name").max(100),
  company_name: z.string().trim().min(2, "Company name is required").max(150),
  email: z.string().trim().email("Enter a valid email").max(200),
  phone: z.string().trim().min(5, "Phone is required").max(30),
  country: z.string().trim().min(2, "Country is required").max(80),
  quantity: z.string().trim().min(1, "Quantity is required").max(80),
  delivery_port: z.string().trim().min(2, "Delivery port is required").max(120),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

export function ProductEnquiryForm({ productName, productId = "" }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const parsed = schema.safeParse(Object.fromEntries(new FormData(form).entries()));

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
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerName: parsed.data.buyer_name,
          companyName: parsed.data.company_name,
          email: parsed.data.email,
          phone: parsed.data.phone,
          country: parsed.data.country,
          product: productId,
          productNameSnapshot: productName,
          quantity: parsed.data.quantity,
          deliveryPort: parsed.data.delivery_port,
          notes: parsed.data.notes || "",
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to send enquiry");
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
      <div className="rounded-xl border border-border bg-surface-muted p-6 text-center">
        <CheckCircle2 className="mx-auto h-8 w-8 text-gold" />
        <p className="mt-2 text-sm font-semibold text-navy">Enquiry sent</p>
        <p className="mt-1 text-xs text-muted-foreground">Our team will respond shortly.</p>
        <Button className="mt-4" size="sm" variant="outline" onClick={() => setSuccess(false)}>Send another</Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4" noValidate>
      <p className="text-xs text-muted-foreground">Enquiring about: <span className="font-semibold text-navy">{productName}</span></p>
      <div className="grid gap-4 sm:grid-cols-2">
        <SmallField label="Buyer name *" error={errors.buyer_name}><Input name="buyer_name" required /></SmallField>
        <SmallField label="Company *" error={errors.company_name}><Input name="company_name" required /></SmallField>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <SmallField label="Email *" error={errors.email}><Input name="email" type="email" required /></SmallField>
        <SmallField label="Phone *" error={errors.phone}><Input name="phone" type="tel" required /></SmallField>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <SmallField label="Country *" error={errors.country}><Input name="country" required /></SmallField>
        <SmallField label="Quantity *" error={errors.quantity}><Input name="quantity" required /></SmallField>
      </div>
      <SmallField label="Delivery port / city *" error={errors.delivery_port}><Input name="delivery_port" required /></SmallField>
      <SmallField label="Notes" error={errors.notes}><Textarea name="notes" rows={3} /></SmallField>
      {formError && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{formError}</p>}
      <Button type="submit" variant="gold" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {loading ? "Sending..." : "Send Enquiry"}
      </Button>
    </form>
  );
}

function SmallField({ label, children, error }) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-[11px] font-semibold uppercase tracking-wider text-navy/80">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
