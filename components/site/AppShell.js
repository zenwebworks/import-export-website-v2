"use client";

import { SITE } from "@/lib/site";
import { absoluteUrl, jsonLd } from "@/lib/seo";
import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { ScrollToTop } from "@/components/site/ScrollToTop";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";

export function AppShell({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", "@type": "Organization", "@id": absoluteUrl("/#organization"), name: SITE.name, url: absoluteUrl(), logo: absoluteUrl("/assets/logo-last.webp"), email: SITE.email, telephone: SITE.phone, address: { "@type": "PostalAddress", streetAddress: SITE.address, addressCountry: "IN" } }) }} />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <WhatsAppButton />
      <ScrollToTop />
    </div>
  );
}
