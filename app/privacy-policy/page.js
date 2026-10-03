import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { SITE } from "@/lib/site";

export const metadata = {
  title: "Privacy Policy",
  description:
    "Read how Meridian Global Trade collects, uses, and protects your personal information when you contact us or request an export quote.",
  alternates: { canonical: "/privacy-policy" },
};

const sections = [
  {
    title: "Information We Collect",
    body: "We collect information you provide directly through our contact and quote-request forms, including your name, company, email, phone number, WhatsApp number, country, product requirements and any additional details you share.",
  },
  {
    title: "How We Use Information",
    body: "We use the information you provide to respond to enquiries, prepare quotations, arrange logistics, communicate order updates and improve our services. We do not sell your personal information.",
  },
  {
    title: "Contact and Quote Forms",
    body: "Data submitted through our contact and quote forms is stored securely in our backend. Only authorised personnel from our sales and export team can access this information for the purpose of following up with you.",
  },
  {
    title: "Cookies",
    body: "Our website uses essential cookies to ensure the site functions correctly and to remember basic preferences. We do not use tracking cookies for advertising.",
  },
  {
    title: "Data Storage",
    body: "Personal data is stored on secure managed cloud infrastructure with encryption at rest and in transit. We retain enquiry data only as long as needed to serve your request or comply with legal obligations.",
  },
  {
    title: "Information Sharing",
    body: "We share information only with trusted logistics providers, banks and regulatory authorities strictly to the extent required to fulfil an order or comply with export documentation requirements.",
  },
  {
    title: "Third-Party Services",
    body: "Our website may use third-party services for hosting, analytics and communication. These providers are contractually required to protect your information.",
  },
  {
    title: "Data Security",
    body: "We follow reasonable technical and organisational measures to safeguard your information, including access controls, encryption and secure development practices.",
  },
  {
    title: "User Rights",
    body: "You may request access to, correction of, or deletion of personal information we hold about you by contacting our team using the details below.",
  },
  {
    title: "Policy Updates",
    body: "We may update this Privacy Policy from time to time. The most recent version is always available on this page.",
  },
  {
    title: "Contact Information",
    body: `For privacy-related enquiries, contact ${SITE.email} or call ${SITE.phone}.`,
  },
];

export default function PrivacyPage() {
  const updated = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <section className="bg-gradient-navy text-white">
        <div className="container-x py-12 md:py-16">
          <Breadcrumbs items={[{ label: "Privacy Policy" }]} />
          <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">Privacy Policy</h1>
          <p className="mt-3 text-sm text-white/80">Last updated: {updated}</p>
        </div>
      </section>

      <section className="container-x py-14">
        <div className="mx-auto max-w-3xl space-y-8">
          <p className="leading-relaxed text-muted-foreground">
            This Privacy Policy explains how {SITE.name} collects, uses and protects information
            you share with us through this website. We handle your data with care and use it only
            for the purposes described below.
          </p>
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-xl font-bold text-navy">{section.title}</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">{section.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
