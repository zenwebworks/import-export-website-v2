"use client";

import { cloneElement, useId, useMemo, useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { buildQuotePayload, createQuoteFormSchema, quoteNotesLimit } from "@/lib/quote-form";

export function QuoteForm({ defaultProduct = "", products = [], service = "export", importCategory = "" }) {
  const isImport = service === "import";
  const context = { service, category: importCategory };
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const initialProduct = products.find((product) => product.slug === defaultProduct || product.id === defaultProduct)?._id || defaultProduct;
  const [productId, setProductId] = useState(initialProduct || "");
  const selected = useMemo(() => products.find((product) => product._id === productId || product.id === productId || product.slug === productId) ?? null, [productId, products]);

  async function onSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const raw = Object.fromEntries(new FormData(form).entries());
    const parsed = createQuoteFormSchema(context).safeParse({ ...raw, product: isImport ? "" : productId });

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

    const payload = buildQuotePayload(parsed.data, { ...context, selectedProduct: selected });

    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to submit quote request");
      setSuccess(true);
      setProductId("");
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
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gold/15 text-gold"><CheckCircle2 className="h-7 w-7" /></div>
        <h3 className="mt-4 text-xl font-bold text-navy">Thank you for your enquiry</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">Our {isImport ? "import" : "export"} team will review your requirements and contact you shortly with product availability, pricing and shipping details.</p>
        <Button className="mt-6" variant="navy" onClick={() => setSuccess(false)}>Submit another request</Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Buyer name *" error={errors.buyer_name}><Input name="buyer_name" required autoComplete="name" /></Field>
        <Field label="Company name *" error={errors.company_name}><Input name="company_name" required autoComplete="organization" /></Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Business email *" error={errors.email}><Input name="email" type="email" required autoComplete="email" /></Field>
        <Field label="Phone *" error={errors.phone}><Input name="phone" type="tel" required autoComplete="tel" /></Field>
      </div>
      <Field label="Country *" error={errors.country}><Input name="country" required autoComplete="country-name" defaultValue={isImport ? "India" : ""} /></Field>

      <div className="grid gap-5 rounded-xl border border-border bg-surface-muted p-5">
        <p className="text-sm font-semibold text-navy">Product requirement</p>
        {isImport ? (
          <>
            {importCategory && <p className="text-sm text-muted-foreground">Import category: <strong className="text-navy">{importCategory}</strong></p>}
            <Field label="Product you want to import *" error={errors.product_name}>
              <Input name="product_name" placeholder="e.g. CNC milling machine or electronic components" maxLength={200} required />
            </Field>
          </>
        ) : <Field label="Product" error={errors.product}>
          <Select value={productId || "none"} onChange={(event) => setProductId(event.target.value === "none" ? "" : event.target.value)}>
            <option value="none">Not listed / general enquiry</option>
            {products.map((product) => <option key={product.id} value={product._id || product.id}>{product.name}</option>)}
          </Select>
        </Field>}
        {selected && <p className="-mt-2 text-xs text-muted-foreground">Selected: {selected.name}</p>}
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Quantity *" error={errors.quantity}><Input name="quantity" placeholder={isImport ? "e.g. 10 units or 500 kg" : "e.g. 500 MT"} required /></Field>
          <Field label={isImport ? "Delivery port / city in India *" : "Delivery port / city *"} error={errors.delivery_port}><Input name="delivery_port" placeholder={isImport ? "e.g. Chennai or Mumbai" : "e.g. Jebel Ali, Dubai"} required /></Field>
        </div>
        <Field label={isImport ? "Specifications & sourcing details" : "Notes"} error={errors.notes}><Textarea name="notes" rows={4} maxLength={quoteNotesLimit(context)} placeholder={isImport ? "Origin country (if known), product specifications, packaging, target price and preferred delivery date..." : "Packaging preference, payment terms, certifications, target price..."} /></Field>
      </div>

      {formError && <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{formError}</p>}

      <Button type="submit" size="xl" variant="gold" disabled={loading} className="w-full sm:w-auto">
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        {loading ? "Sending..." : "Submit Quote Request"}
      </Button>
    </form>
  );
}

function Field({ label, children, error }) {
  const id = useId();
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-navy/80">{label}</Label>
      {cloneElement(children, { id, "aria-invalid": Boolean(error), "aria-describedby": error ? `${id}-error` : undefined })}
      {error && <p id={`${id}-error`} className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

