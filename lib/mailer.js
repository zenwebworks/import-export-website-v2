import nodemailer from "nodemailer";
import { SITE } from "@/lib/site";

let transporter;

function canSendMail() {
  return Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

function getTransporter() {
  if (!canSendMail()) return null;
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  return transporter;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function wrapHtml({ title, rows, footer }) {
  const rowsHtml = rows
    .filter((row) => row.value)
    .map(
      (row) => `
      <tr>
        <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;color:#64748b;font:600 12px/1.4 -apple-system,Segoe UI,Roboto,sans-serif;text-transform:uppercase;letter-spacing:.04em;white-space:nowrap;vertical-align:top;">${escapeHtml(row.label)}</td>
        <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;color:#0f2942;font:400 14px/1.5 -apple-system,Segoe UI,Roboto,sans-serif;">${escapeHtml(row.value)}</td>
      </tr>`,
    )
    .join("");

  return `
  <div style="background:#f8fafc;padding:32px 16px;font-family:-apple-system,Segoe UI,Roboto,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;">
      <div style="background:#12213d;padding:24px 28px;">
        <p style="margin:0;color:#d7a53a;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;">${escapeHtml(SITE.name)}</p>
        <h1 style="margin:8px 0 0;color:#ffffff;font-size:20px;font-weight:700;">${escapeHtml(title)}</h1>
      </div>
      <table style="width:100%;border-collapse:collapse;">${rowsHtml}</table>
      <div style="padding:16px 28px;background:#f8fafc;"><p style="margin:0;color:#64748b;font-size:12px;">${escapeHtml(footer)}</p></div>
    </div>
  </div>`;
}

async function sendMail(message) {
  const smtp = getTransporter();
  if (!smtp) return null;
  return smtp.sendMail(message);
}

export async function sendQuoteRequestEmail(quote) {
  const html = wrapHtml({
    title: "New Quote Request",
    rows: [
      { label: "Buyer", value: quote.buyerName },
      { label: "Company", value: quote.companyName },
      { label: "Email", value: quote.email },
      { label: "Phone", value: quote.phone },
      { label: "Country", value: quote.country },
      { label: "Product", value: quote.productNameSnapshot || "General inquiry" },
      { label: "Quantity", value: quote.quantity },
      { label: "Delivery Port / City", value: quote.deliveryPort },
      { label: "Notes", value: quote.notes },
    ],
    footer: "Log in to the admin dashboard to view details and mark this request as processed.",
  });

  return sendMail({
    from: `"${SITE.name}" <${process.env.GMAIL_USER}>`,
    to: process.env.NOTIFY_EMAIL || process.env.GMAIL_USER,
    replyTo: quote.email,
    subject: `New Quote Request - ${quote.companyName}`,
    html,
  });
}

export async function sendQuoteConfirmationEmail(quote) {
  const html = wrapHtml({
    title: "We received your quote request",
    rows: [
      { label: "Reference", value: `MGT-${String(quote._id).slice(-6).toUpperCase()}` },
      { label: "Product", value: quote.productNameSnapshot || "General inquiry" },
      { label: "Quantity", value: quote.quantity },
      { label: "Delivery Port / City", value: quote.deliveryPort },
    ],
    footer: `Our trade desk typically responds within 1-2 business days. Thank you for considering ${SITE.name}.`,
  });

  return sendMail({
    from: `"${SITE.name}" <${process.env.GMAIL_USER}>`,
    to: quote.email,
    subject: `${SITE.name} - Quote Request Received`,
    html,
  });
}

export async function sendContactMessageEmail(message) {
  const html = wrapHtml({
    title: "New Contact Message",
    rows: [
      { label: "Name", value: message.name },
      { label: "Company", value: message.company },
      { label: "Email", value: message.email },
      { label: "Phone", value: message.phone },
      { label: "Message", value: message.message },
    ],
    footer: "Log in to the admin dashboard to view and respond.",
  });

  return sendMail({
    from: `"${SITE.name}" <${process.env.GMAIL_USER}>`,
    to: process.env.NOTIFY_EMAIL || process.env.GMAIL_USER,
    replyTo: message.email,
    subject: `New Contact Message - ${message.name}`,
    html,
  });
}
