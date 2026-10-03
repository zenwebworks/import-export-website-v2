import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp, FaYoutube } from "react-icons/fa6";
import { SITE } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const socials = [
    { href: SITE.socials.facebook, label: "Facebook", bg: "#1877F2", icon: FaFacebookF },
    { href: SITE.socials.linkedin, label: "LinkedIn", bg: "#0A66C2", icon: FaLinkedinIn },
    {
      href: SITE.socials.instagram,
      label: "Instagram",
      bg: "linear-gradient(45deg,#f9ce34,#ee2a7b,#6228d7)",
      icon: FaInstagram,
    },
    { href: "#", label: "YouTube", bg: "#FF0000", icon: FaYoutube },
    { href: SITE.whatsappHref, label: "WhatsApp", bg: "#25D366", icon: FaWhatsapp },
  ];

  return (
    <footer className="bg-[#061018] text-white">
      <div className="border-y border-gold/25 bg-[#08131d]">
        <div className="container-x grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-[1.25fr_0.8fr_1fr_1fr_1.15fr]">
          <div>
            <Link href="/" className="inline-flex items-center" aria-label={SITE.name}>
              <img
                src="/assets/logo-last.webp"
                alt={SITE.name}
                className="h-16 w-auto max-w-[260px] object-contain sm:h-20 sm:max-w-[300px]"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/68">
              Importer, exporter and global supplier connecting Indian products with businesses
              worldwide through trusted sourcing and trade support.
            </p>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-gold">
              Importer | Exporter | Global Supplier
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {socials.map(({ href, icon: Icon, label, bg }) => (
                <a
                  key={label}
                  href={href || "#"}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-md text-white shadow-sm transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
                  style={{ background: bg }}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn
            title="Quick Links"
            links={[
              ["/", "Home"],
              ["/about", "About Us"],
              ["/sourcing", "Sourcing"],
              ["/products", "Products"],
              ["/categories", "Categories"],
              ["/export-services", "Export Services"],
              ["/import-services", "Import Services"],
              ["/collaboration", "Collaboration"],
              ["/contact", "Contact Us"],
            ]}
          />

          <FooterColumn
            title="Product Categories"
            links={[
              ["/categories", "Spices and Powders"],
              ["/categories", "Dried Foods and Nuts"],
              ["/categories", "Herbal Products"],
              ["/categories", "Oils"],
              ["/categories", "Food and Agriculture"],
              ["/categories", "Handicrafts"],
              ["/categories", "Metal Products"],
            ]}
          />

          <FooterColumn
            title="Our Services"
            links={[
              ["/sourcing", "Product Sourcing"],
              ["/sourcing", "Supplier Verification"],
              ["/sourcing", "Quality Checking"],
              ["/#about", "Custom Packaging"],
              ["/import-services", "Import Support"],
              ["/export-services", "Export Solutions"],
              ["/collaboration", "Business Collaboration"],
              ["/contact", "Global Trade Support"],
            ]}
          />

          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-gold">Contact Us</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <ContactLine icon={Phone}>
                <a href={SITE.phoneHref} className="hover:text-white">{SITE.phone}</a>
              </ContactLine>
              <ContactLine icon={Mail}>
                <a href={`mailto:${SITE.email}`} className="hover:text-white">{SITE.email}</a>
              </ContactLine>
              <ContactLine icon={MapPin}>{SITE.address}</ContactLine>
              <ContactLine icon={Clock}>{SITE.hours}</ContactLine>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-[#030a10]">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-4 text-xs text-white/48 sm:flex-row">
          <p>Copyright {year} {SITE.name}. All rights reserved.</p>
          <p>
            <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <span className="mx-2 text-gold/60">|</span>
            Designed for global trade excellence
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="text-sm font-extrabold uppercase tracking-wider text-gold">{title}</h3>
      <ul className="mt-4 space-y-2 text-sm text-white/68">
        {links.map(([href, label]) => (
          <li key={`${href}-${label}`}>
            <Link href={href} className="transition-colors hover:text-gold">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactLine({ icon: Icon, children }) {
  return (
    <li className="flex gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
      <span>{children}</span>
    </li>
  );
}
