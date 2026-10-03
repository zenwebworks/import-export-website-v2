// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useCallback, useEffect, useRef, useState } from "react";
// import { ChevronDown, Globe, Mail, MapPin, Menu, Package, Phone, Truck, X } from "lucide-react";
// import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp, FaYoutube } from "react-icons/fa6";
// import { Button } from "@/components/ui/button";
// import { SITE } from "@/lib/site";
// import { cn } from "@/lib/utils";

// const NAV_ITEMS = [
//   { id: "home", href: "/", label: "Home" },
//   { id: "about", href: "/about", label: "About Us" },
//   { id: "sourcing", href: "/sourcing", label: "Sourcing" },
//   { id: "products", href: "/products", label: "Products" },
//   { id: "catalogue", href: "/categories", label: "Catalogue" },
//   {
//     id: "services",
//     label: "Services",
//     dropdown: [
//       {
//         href: "/sourcing",
//         label: "Sourcing Services",
//         desc: "Supplier search, QC and pricing",
//         icon: Search,
//       },
//       {
//         href: "/#export-services",
//         label: "Export Services",
//         desc: "Outbound shipping coordination",
//         icon: Truck,
//       },
//       {
//         href: "/#import-services",
//         label: "Import Services",
//         desc: "Global procurement, brought in",
//         icon: Package,
//       },
//     ],
//   },
//   { id: "contact", href: "/contact", label: "Contact Us" },
// ];

// const SOCIAL_LINKS = [
//   { key: "facebook", label: "Facebook", href: SITE.facebook, bg: "#1877F2", Icon: FaFacebookF },
//   { key: "linkedin", label: "LinkedIn", href: SITE.linkedin, bg: "#0A66C2", Icon: FaLinkedinIn },
//   {
//     key: "instagram",
//     label: "Instagram",
//     href: SITE.instagram,
//     bg: "linear-gradient(45deg,#f9ce34,#ee2a7b,#6228d7)",
//     Icon: FaInstagram,
//   },
//   { key: "youtube", label: "YouTube", href: SITE.youtube, bg: "#FF0000", Icon: FaYoutube },
//   { key: "whatsapp", label: "WhatsApp", href: SITE.whatsapp, bg: "#25D366", Icon: FaWhatsapp },
// ];

// function InfoBadge({ icon: Icon, href, children }) {
//   const content = (
//     <>
//       <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-gold/60 bg-white/5 text-gold">
//         <Icon className="h-3.5 w-3.5" />
//       </span>
//       <span className="whitespace-nowrap text-[11px] font-semibold text-white/85">{children}</span>
//     </>
//   );
//   if (href) {
//     return (
//       <a href={href} className="flex items-center gap-2 transition-colors hover:text-gold">
//         {content}
//       </a>
//     );
//   }
//   return <span className="flex items-center gap-2">{content}</span>;
// }

// function SocialRow({ size = "h-7 w-7", iconSize = "h-3.5 w-3.5", className }) {
//   return (
//     <div className={cn("flex shrink-0 items-center gap-2", className)}>
//       {SOCIAL_LINKS.map(({ key, label, href, bg, Icon }) => (
//         <a
//           key={key}
//           href={href || "#"}
//           target="_blank"
//           rel="noreferrer"
//           aria-label={label}
//           className={cn(
//             size,
//             "grid place-items-center rounded-md text-white shadow-sm transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60",
//           )}
//           style={{ background: bg }}
//         >
//           <Icon className={iconSize} />
//         </a>
//       ))}
//     </div>
//   );
// }

// export function SiteHeader() {
//   const pathname = usePathname();
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
//   const [servicesOpen, setServicesOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const [indicator, setIndicator] = useState({ left: 0, width: 0, visible: false });

//   const navRef = useRef(null);
//   const itemRefs = useRef({});
//   const servicesGroupRef = useRef(null);
//   const closeTimer = useRef(null);

//   const isRouteActive = (item) =>
//     item.href &&
//     !item.href.includes("#") &&
//     (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href));

//   const moveIndicatorTo = useCallback((id) => {
//     const el = itemRefs.current[id];
//     const nav = navRef.current;
//     if (!el || !nav) return;
//     const elRect = el.getBoundingClientRect();
//     const navRect = nav.getBoundingClientRect();
//     setIndicator({ left: elRect.left - navRect.left, width: elRect.width, visible: true });
//   }, []);

//   const resetIndicatorToActive = useCallback(() => {
//     const active = NAV_ITEMS.find((item) => isRouteActive(item));
//     if (active) {
//       moveIndicatorTo(active.id);
//     } else {
//       setIndicator((prev) => ({ ...prev, visible: false }));
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [pathname, moveIndicatorTo]);

//   useEffect(() => {
//     const raf = requestAnimationFrame(resetIndicatorToActive);
//     return () => cancelAnimationFrame(raf);
//   }, [resetIndicatorToActive]);

//   useEffect(() => {
//     const onResize = () => resetIndicatorToActive();
//     window.addEventListener("resize", onResize);
//     return () => window.removeEventListener("resize", onResize);
//   }, [resetIndicatorToActive]);

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 8);
//     onScroll();
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   useEffect(() => {
//     setMobileOpen(false);
//     setMobileServicesOpen(false);
//   }, [pathname]);

//   useEffect(() => {
//     document.body.style.overflow = mobileOpen ? "hidden" : "";
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [mobileOpen]);

//   useEffect(() => {
//     if (!mobileOpen) return;
//     const onKey = (e) => {
//       if (e.key === "Escape") setMobileOpen(false);
//     };
//     document.addEventListener("keydown", onKey);
//     return () => document.removeEventListener("keydown", onKey);
//   }, [mobileOpen]);

//   useEffect(() => {
//     if (!servicesOpen) return;
//     const onClickOutside = (e) => {
//       if (servicesGroupRef.current && !servicesGroupRef.current.contains(e.target)) {
//         setServicesOpen(false);
//       }
//     };
//     const onKey = (e) => {
//       if (e.key === "Escape") setServicesOpen(false);
//     };
//     document.addEventListener("mousedown", onClickOutside);
//     document.addEventListener("keydown", onKey);
//     return () => {
//       document.removeEventListener("mousedown", onClickOutside);
//       document.removeEventListener("keydown", onKey);
//     };
//   }, [servicesOpen]);

//   const openServices = () => {
//     if (closeTimer.current) clearTimeout(closeTimer.current);
//     setServicesOpen(true);
//   };
//   const scheduleCloseServices = () => {
//     closeTimer.current = setTimeout(() => setServicesOpen(false), 150);
//   };

//   return (
//     <header
//       className={cn(
//         "sticky top-0 z-50 w-full border-b border-gold/35 text-white transition-shadow duration-300",
//         scrolled ? "shadow-[0_14px_34px_rgba(0,0,0,0.32)]" : "shadow-none",
//       )}
//     >
//       <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />

//       {/* Everything with backdrop-blur lives in this inner wrapper, NOT on <header> itself.
//           backdrop-filter creates a containing block for position:fixed descendants, which
//           was trapping the full-screen mobile nav inside the header's own (tiny) box. */}
//       <div className="relative bg-[linear-gradient(90deg,rgba(3,16,29,0.98),rgba(6,25,39,0.97)_42%,rgba(8,33,51,0.96))] backdrop-blur-xl">
//         {/* Utility bar */}
//         <div
//           className={cn(
//             "hidden overflow-hidden border-b border-white/10 transition-all duration-300 ease-out md:block",
//             scrolled ? "max-h-0 opacity-0" : "max-h-14 opacity-100",
//           )}
//         >
//           <div className="container-x flex h-10 items-center justify-between gap-4">
//             <div className="flex items-center gap-4 xl:gap-5">
//               <InfoBadge icon={Phone} href={SITE.phoneHref}>
//                 {SITE.phone}
//               </InfoBadge>
//               {SITE.email && (
//                 <div className="hidden lg:block">
//                   <InfoBadge icon={Mail} href={`mailto:${SITE.email}`}>
//                     {SITE.email}
//                   </InfoBadge>
//                 </div>
//               )}
//               <div className="hidden items-center gap-4 xl:flex xl:gap-5">
//                 <InfoBadge icon={MapPin}>India</InfoBadge>
//                 <InfoBadge icon={Globe}>Global Trade</InfoBadge>
//               </div>
//             </div>

//             <p className="hidden items-center gap-2 whitespace-nowrap text-[11px] font-bold uppercase tracking-wide text-white/85 xl:flex">
//               <span>Importer</span>
//               <span className="text-gold">|</span>
//               <span>Exporter</span>
//               <span className="text-gold">|</span>
//               <span>Global Supplier</span>
//             </p>

//             <SocialRow />
//           </div>
//         </div>

//         {/* Main bar */}
//         <div className="container-x">
//           <div
//             className={cn(
//               "flex items-center gap-4 transition-[height] duration-300 ease-out",
//               scrolled ? "h-16" : "h-[4.5rem] sm:h-20",
//             )}
//           >
//             <Link
//               href="/"
//               className="group flex shrink-0 items-center rounded-md px-1.5 py-1 transition-colors hover:bg-white/[0.04]"
//               aria-label={SITE.name}
//             >
//               <img
//                 src="/assets/navbar-logo.webp"
//                 alt={SITE.name}
//                 className={cn(
//                   "w-auto max-w-full object-contain brightness-110 drop-shadow-[0_0_16px_rgba(245,178,61,0.48)] transition-all duration-300 group-hover:scale-[1.02]",
//                   scrolled ? "h-10" : "h-11 sm:h-14",
//                 )}
//               />
//             </Link>

//             <nav
//               ref={navRef}
//               onMouseLeave={resetIndicatorToActive}
//               className="relative ml-2 hidden h-full flex-1 items-center gap-1 lg:flex xl:gap-1.5"
//             >
//               <span
//                 className="pointer-events-none absolute bottom-0 h-[2px] rounded-full bg-gold shadow-[0_0_10px_rgba(245,178,61,0.85)] transition-all duration-300 ease-out"
//                 style={{ left: indicator.left, width: indicator.width, opacity: indicator.visible ? 1 : 0 }}
//               />

//               {NAV_ITEMS.map((item) => {
//                 if (item.dropdown) {
//                   return (
//                     <div
//                       key={item.id}
//                       ref={servicesGroupRef}
//                       className="relative h-full"
//                       onMouseEnter={() => {
//                         openServices();
//                         moveIndicatorTo(item.id);
//                       }}
//                       onMouseLeave={scheduleCloseServices}
//                     >
//                       <button
//                         ref={(el) => (itemRefs.current[item.id] = el)}
//                         type="button"
//                         aria-haspopup="true"
//                         aria-expanded={servicesOpen}
//                         onClick={() => setServicesOpen((v) => !v)}
//                         className="inline-flex h-full shrink-0 items-center gap-1 rounded px-2.5 text-[13px] font-semibold text-white/85 transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 xl:px-3 xl:text-sm"
//                       >
//                         {item.label}
//                         <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", servicesOpen ? "rotate-180" : "")} />
//                       </button>

//                       <div
//                         className={cn(
//                           "absolute left-1/2 top-full z-10 w-72 -translate-x-1/2 pt-3 transition-all duration-200",
//                           servicesOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0",
//                         )}
//                       >
//                         <div className="overflow-hidden rounded-xl border border-border bg-white shadow-elevated">
//                           {item.dropdown.map((sub) => (
//                             <Link
//                               key={sub.href}
//                               href={sub.href}
//                               onClick={() => setServicesOpen(false)}
//                               className="flex items-start gap-3 border-b border-border/70 px-4 py-3 last:border-b-0 hover:bg-surface"
//                             >
//                               <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-navy text-white">
//                                 <sub.icon className="h-4 w-4" />
//                               </span>
//                               <span>
//                                 <span className="block text-sm font-semibold text-navy">{sub.label}</span>
//                                 <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">{sub.desc}</span>
//                               </span>
//                             </Link>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 }

//                 const active = isRouteActive(item);
//                 return (
//                   <Link
//                     key={item.id}
//                     href={item.href}
//                     ref={(el) => (itemRefs.current[item.id] = el)}
//                     onMouseEnter={() => moveIndicatorTo(item.id)}
//                     className={cn(
//                       "inline-flex h-full shrink-0 items-center rounded px-2.5 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 xl:px-3 xl:text-sm",
//                       active ? "text-gold" : "text-white/85 hover:text-gold",
//                     )}
//                   >
//                     {item.label}
//                   </Link>
//                 );
//               })}
//             </nav>

//             <div className="flex-1 lg:hidden" />

//             <div className="hidden items-center gap-3 md:flex">
//               <Button
//                 asChild
//                 variant="gold"
//                 size="default"
//                 className="h-10 rounded px-3 text-[11px] font-extrabold uppercase text-[#061626] shadow-[0_0_22px_rgba(245,178,61,0.42)] xl:px-4 xl:text-xs"
//               >
//                 <Link href="/request-a-quote">Request a Quote</Link>
//               </Button>
//             </div>

//             <Button
//               variant="ghost"
//               size="icon"
//               className="shrink-0 rounded border border-white/10 bg-white/[0.05] text-white hover:border-gold/35 hover:bg-gold/10 hover:text-gold lg:hidden"
//               aria-label="Open menu"
//               aria-expanded={mobileOpen}
//               onClick={() => setMobileOpen(true)}
//             >
//               <Menu className="h-5 w-5" />
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile full-screen nav — a sibling of the blurred wrapper above, NOT nested inside it,
//           so it correctly anchors to the real viewport instead of the header's own box. */}
//       <div
//         className={cn(
//           "fixed inset-0 z-50 flex flex-col overflow-hidden lg:hidden",
//           "bg-[linear-gradient(160deg,#03101d,#061927_55%,#03121f)] text-white",
//           "transition-opacity duration-300 ease-out",
//           mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
//         )}
//         aria-hidden={!mobileOpen}
//       >
//         <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />

//         <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
//           <Link href="/" className="flex items-center" aria-label={SITE.name} onClick={() => setMobileOpen(false)}>
//             <img
//               src="/assets/navbar-logo.webp"
//               alt={SITE.name}
//               className="h-11 w-auto max-w-[190px] object-contain brightness-110"
//             />
//           </Link>
//           <button
//             type="button"
//             aria-label="Close menu"
//             tabIndex={mobileOpen ? 0 : -1}
//             onClick={() => setMobileOpen(false)}
//             className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white transition-colors hover:border-gold/50 hover:text-gold"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         <nav className="flex-1 overflow-y-auto px-5 py-6">
//           <ul className="flex flex-col">
//             {NAV_ITEMS.map((item, index) => {
//               if (item.dropdown) {
//                 return (
//                   <li key={item.id} className="border-b border-white/10">
//                     <button
//                       type="button"
//                       onClick={() => setMobileServicesOpen((v) => !v)}
//                       aria-expanded={mobileServicesOpen}
//                       className="flex w-full items-center justify-between py-4 text-left"
//                     >
//                       <span className="font-display text-2xl font-bold tracking-tight text-white/95">{item.label}</span>
//                       <ChevronDown
//                         className={cn("h-5 w-5 text-gold transition-transform", mobileServicesOpen ? "rotate-180" : "")}
//                       />
//                     </button>
//                     <div
//                       className={cn(
//                         "grid overflow-hidden transition-all duration-300",
//                         mobileServicesOpen ? "grid-rows-[1fr] pb-4 opacity-100" : "grid-rows-[0fr] opacity-0",
//                       )}
//                     >
//                       <div className="min-h-0 border-l border-gold/30 pl-4">
//                         {item.dropdown.map((sub) => (
//                           <Link
//                             key={sub.href}
//                             href={sub.href}
//                             onClick={() => setMobileOpen(false)}
//                             className="flex items-center gap-2.5 py-2.5 text-sm font-semibold text-white/75 hover:text-gold"
//                           >
//                             <sub.icon className="h-4 w-4 text-gold/80" />
//                             {sub.label}
//                           </Link>
//                         ))}
//                       </div>
//                     </div>
//                   </li>
//                 );
//               }

//               const active = isRouteActive(item);
//               return (
//                 <li key={item.id} className="border-b border-white/10">
//                   <Link
//                     href={item.href}
//                     onClick={() => setMobileOpen(false)}
//                     className={cn(
//                       "group flex items-center justify-between py-4 transition-colors",
//                       active ? "text-gold" : "text-white/95 hover:text-gold",
//                     )}
//                   >
//                     <span className="font-display text-2xl font-bold tracking-tight">{item.label}</span>
//                     <span className="text-xs font-semibold text-gold/60 transition-transform group-hover:translate-x-1">
//                       {String(index + 1).padStart(2, "0")}
//                     </span>
//                   </Link>
//                 </li>
//               );
//             })}
//           </ul>
//         </nav>

//         <div className="border-t border-white/10 px-5 py-5">
//           <Button
//             asChild
//             variant="gold"
//             size="lg"
//             className="w-full rounded text-sm font-extrabold uppercase text-[#061626] shadow-[0_0_22px_rgba(245,178,61,0.38)]"
//           >
//             <Link href="/request-a-quote" onClick={() => setMobileOpen(false)}>
//               Request a Quote
//             </Link>
//           </Button>

//           <div className="mt-4 flex items-center justify-between gap-3">
//             <div className="flex min-w-0 flex-col gap-1.5 text-xs font-semibold text-white/70">
//               <a href={SITE.phoneHref} className="flex items-center gap-2 hover:text-gold">
//                 <Phone className="h-3.5 w-3.5 shrink-0 text-gold" />
//                 <span className="truncate">{SITE.phone}</span>
//               </a>
//               {SITE.email && (
//                 <a href={`mailto:${SITE.email}`} className="flex items-center gap-2 hover:text-gold">
//                   <Mail className="h-3.5 w-3.5 shrink-0 text-gold" />
//                   <span className="truncate">{SITE.email}</span>
//                 </a>
//               )}
//             </div>
//             <SocialRow size="h-8 w-8" iconSize="h-4 w-4" />
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight, Globe, Handshake, Mail, MapPin, Menu, Package, Phone, Truck, X } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp, FaYoutube } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { id: "home", href: "/", label: "Home" },
  { id: "about", href: "/about", label: "About Us" },
  { id: "sourcing", href: "/sourcing", label: "Sourcing" },
  { id: "products", href: "/products", label: "Products" },
  { id: "catalogue", href: "/categories", label: "Catalogue" },
  {
    id: "services",
    label: "Services",
    dropdown: [
      {
        href: "/export-services",
        label: "Export Services",
        desc: "Outbound shipping coordination",
        icon: Truck,
      },
      {
        href: "/import-services",
        label: "Import Services",
        desc: "Global procurement, brought in",
        icon: Package,
      },
      {
        href: "/collaboration",
        label: "Collaboration",
        desc: "Partnerships for shared global growth",
        icon: Handshake,
      },
    ],
  },
  { id: "contact", href: "/contact", label: "Contact Us" },
];

const SOCIAL_LINKS = [
  { key: "facebook", label: "Facebook", href: SITE.facebook, bg: "#1877F2", Icon: FaFacebookF },
  { key: "linkedin", label: "LinkedIn", href: SITE.linkedin, bg: "#0A66C2", Icon: FaLinkedinIn },
  {
    key: "instagram",
    label: "Instagram",
    href: SITE.instagram,
    bg: "linear-gradient(45deg,#f9ce34,#ee2a7b,#6228d7)",
    Icon: FaInstagram,
  },
  { key: "youtube", label: "YouTube", href: SITE.youtube, bg: "#FF0000", Icon: FaYoutube },
  { key: "whatsapp", label: "WhatsApp", href: SITE.whatsapp, bg: "#25D366", Icon: FaWhatsapp },
];

// Shared so the desktop header and the mobile full-screen nav can never visually drift apart.
const HEADER_BG_GRADIENT = "bg-[linear-gradient(160deg,#03101d,#061927_55%,#03121f)]";

function InfoBadge({ icon: Icon, href, children }) {
  const content = (
    <>
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-gold/60 bg-white/5 text-gold">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="whitespace-nowrap text-[11px] font-semibold text-white/85">{children}</span>
    </>
  );
  if (href) {
    return (
      <a href={href} className="flex items-center gap-2 transition-colors hover:text-gold">
        {content}
      </a>
    );
  }
  return <span className="flex items-center gap-2">{content}</span>;
}

function SocialRow({ size = "h-7 w-7", iconSize = "h-3.5 w-3.5", gap = "gap-2", className }) {
  return (
    <div className={cn("flex shrink-0 items-center", gap, className)}>
      {SOCIAL_LINKS.map(({ key, label, href, bg, Icon }) => (
        <a
          key={key}
          href={href || "#"}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          className={cn(
            size,
            "grid place-items-center rounded-md text-white shadow-sm transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60",
          )}
          style={{ background: bg }}
        >
          <Icon className={iconSize} />
        </a>
      ))}
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const quoteHref = pathname === "/import-services" ? "/request-a-quote?service=import" : "/request-a-quote";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, visible: false });

  const navRef = useRef(null);
  const itemRefs = useRef({});
  const servicesGroupRef = useRef(null);
  const closeTimer = useRef(null);

  const isRouteActive = (item) => {
    const matches = (href) => href && !href.includes("#") &&
      (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));
    return matches(item.href) || item.dropdown?.some((sub) => matches(sub.href));
  };

  const moveIndicatorTo = useCallback((id) => {
    const el = itemRefs.current[id];
    const nav = navRef.current;
    if (!el || !nav) return;
    const elRect = el.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();
    setIndicator({ left: elRect.left - navRect.left, width: elRect.width, visible: true });
  }, []);

  const resetIndicatorToActive = useCallback(() => {
    const active = NAV_ITEMS.find((item) => isRouteActive(item));
    if (active) {
      moveIndicatorTo(active.id);
    } else {
      setIndicator((prev) => ({ ...prev, visible: false }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, moveIndicatorTo]);

  useEffect(() => {
    const raf = requestAnimationFrame(resetIndicatorToActive);
    return () => cancelAnimationFrame(raf);
  }, [resetIndicatorToActive]);

  useEffect(() => {
    const onResize = () => resetIndicatorToActive();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [resetIndicatorToActive]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMobileServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  useEffect(() => {
    if (!servicesOpen) return;
    const onClickOutside = (e) => {
      if (servicesGroupRef.current && !servicesGroupRef.current.contains(e.target)) {
        setServicesOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setServicesOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [servicesOpen]);

  const openServices = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };
  const scheduleCloseServices = () => {
    closeTimer.current = setTimeout(() => setServicesOpen(false), 150);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-gold/35 text-white transition-shadow duration-300",
        scrolled ? "shadow-[0_14px_34px_rgba(0,0,0,0.32)]" : "shadow-none",
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />

      {/* Everything with backdrop-blur lives in this inner wrapper, NOT on <header> itself —
          backdrop-filter creates a containing block for position:fixed descendants, which
          would trap the full-screen mobile nav inside the header's own (tiny) box. */}
      <div className={cn("relative backdrop-blur-xl", HEADER_BG_GRADIENT)}>
        {/* Utility bar */}
        <div
          className={cn(
            "hidden overflow-hidden border-b border-white/10 transition-all duration-300 ease-out md:block",
            scrolled ? "max-h-0 opacity-0" : "max-h-14 opacity-100",
          )}
        >
          <div className="container-x flex h-10 items-center justify-between gap-4">
            <div className="flex items-center gap-4 xl:gap-5">
              <InfoBadge icon={Phone} href={SITE.phoneHref}>
                {SITE.phone}
              </InfoBadge>
              {SITE.email && (
                <div className="hidden lg:block">
                  <InfoBadge icon={Mail} href={`mailto:${SITE.email}`}>
                    {SITE.email}
                  </InfoBadge>
                </div>
              )}
              <div className="hidden items-center gap-4 xl:flex xl:gap-5">
                <InfoBadge icon={MapPin}>India</InfoBadge>
                <InfoBadge icon={Globe}>Global Trade</InfoBadge>
              </div>
            </div>

            <p className="hidden items-center gap-2 whitespace-nowrap text-[11px] font-bold uppercase tracking-wide text-white/85 xl:flex">
              <span>Importer</span>
              <span className="text-gold">|</span>
              <span>Exporter</span>
              <span className="text-gold">|</span>
              <span>Global Supplier</span>
            </p>

            <SocialRow />
          </div>
        </div>

        {/* Main bar */}
        <div className="container-x">
          <div
            className={cn(
              "flex items-center gap-4 transition-[height] duration-300 ease-out",
              scrolled ? "h-16" : "h-[4.5rem] sm:h-20",
            )}
          >
            <Link
              href="/"
              className="group flex shrink-0 items-center rounded-md px-1.5 py-1"
              aria-label={SITE.name}
            >
              <img
                src="/assets/logo-last.webp"
                alt={SITE.name}
                className={cn(
                  "w-auto max-w-full object-contain transition-all duration-300 group-hover:scale-[1.02]",
                  scrolled ? "h-11" : "h-12 sm:h-16",
                )}
              />
            </Link>

            <nav
              ref={navRef}
              onMouseLeave={resetIndicatorToActive}
              className="relative ml-2 hidden h-full flex-1 items-center gap-1 lg:flex xl:gap-1.5"
            >
              <span
                className="pointer-events-none absolute bottom-0 h-[2px] rounded-full bg-gold shadow-[0_0_10px_rgba(245,178,61,0.85)] transition-all duration-300 ease-out"
                style={{ left: indicator.left, width: indicator.width, opacity: indicator.visible ? 1 : 0 }}
              />

              {NAV_ITEMS.map((item) => {
                if (item.dropdown) {
                  return (
                    <div
                      key={item.id}
                      ref={servicesGroupRef}
                      className="relative h-full"
                      onMouseEnter={() => {
                        openServices();
                        moveIndicatorTo(item.id);
                      }}
                      onMouseLeave={scheduleCloseServices}
                    >
                      <button
                        ref={(el) => (itemRefs.current[item.id] = el)}
                        type="button"
                        aria-haspopup="true"
                        aria-expanded={servicesOpen}
                        onClick={() => setServicesOpen((v) => !v)}
                        className={cn("inline-flex h-full shrink-0 items-center gap-1 rounded px-2.5 text-[13px] font-semibold transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 xl:px-3 xl:text-sm", isRouteActive(item) ? "text-gold" : "text-white/85")}
                      >
                        {item.label}
                        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", servicesOpen ? "rotate-180" : "")} />
                      </button>

                      <div
                        inert={!servicesOpen}
                        aria-hidden={!servicesOpen}
                        className={cn(
                          "absolute left-1/2 top-full z-10 w-72 -translate-x-1/2 pt-3 transition-all duration-200",
                          servicesOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0",
                        )}
                      >
                        <div className="overflow-hidden rounded-xl border border-border bg-white shadow-elevated">
                          {item.dropdown.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              aria-current={pathname === sub.href ? "page" : undefined}
                              onClick={() => setServicesOpen(false)}
                              className="flex items-start gap-3 border-b border-border/70 px-4 py-3 last:border-b-0 hover:bg-surface aria-[current=page]:bg-surface"
                            >
                              <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-navy text-white">
                                <sub.icon className="h-4 w-4" />
                              </span>
                              <span>
                                <span className="block text-sm font-semibold text-navy">{sub.label}</span>
                                <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">{sub.desc}</span>
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                const active = isRouteActive(item);
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    ref={(el) => (itemRefs.current[item.id] = el)}
                    onMouseEnter={() => moveIndicatorTo(item.id)}
                    className={cn(
                      "inline-flex h-full shrink-0 items-center rounded px-2.5 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 xl:px-3 xl:text-sm",
                      active ? "text-gold" : "text-white/85 hover:text-gold",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex-1 lg:hidden" />

            <div className="hidden items-center gap-3 md:flex">
              <Button
                asChild
                variant="gold"
                size="default"
                className="h-10 rounded px-3 text-[11px] font-extrabold uppercase text-[#061626] shadow-[0_0_22px_rgba(245,178,61,0.42)] xl:px-4 xl:text-xs"
              >
                <Link href={quoteHref}>Request a Quote</Link>
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 rounded border border-white/10 bg-white/[0.05] text-white hover:border-gold/35 hover:bg-gold/10 hover:text-gold lg:hidden"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile full-screen nav — a sibling of the blurred wrapper above, NOT nested inside it,
          so it correctly anchors to the real viewport instead of the header's own box. */}
      <div
        className={cn(
          "fixed inset-0 z-50 flex flex-col overflow-hidden lg:hidden",
          HEADER_BG_GRADIENT,
          "text-white transition-opacity duration-300 ease-out",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!mobileOpen}
        inert={!mobileOpen}
      >
        <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />

        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          <Link href="/" className="flex items-center" aria-label={SITE.name} onClick={() => setMobileOpen(false)}>
            <img
              src="/assets/logo-last.webp"
              alt={SITE.name}
              className="h-14 w-auto max-w-[220px] object-contain"
            />
          </Link>
          <button
            type="button"
            aria-label="Close menu"
            tabIndex={mobileOpen ? 0 : -1}
            onClick={() => setMobileOpen(false)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white transition-colors hover:border-gold/50 hover:text-gold"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-6">
          <ul className="flex flex-col">
            {NAV_ITEMS.map((item) => {
              if (item.dropdown) {
                return (
                  <li key={item.id} className="border-b border-white/10">
                    <button
                      type="button"
                      onClick={() => setMobileServicesOpen((v) => !v)}
                      aria-expanded={mobileServicesOpen}
                      className="flex w-full items-center justify-between py-4 text-left"
                    >
                      <span className="font-display text-2xl font-bold tracking-tight text-white/95">{item.label}</span>
                      <ChevronDown
                        className={cn("h-5 w-5 text-gold transition-transform", mobileServicesOpen ? "rotate-180" : "")}
                      />
                    </button>
                    <div
                      inert={!mobileServicesOpen}
                      className={cn(
                        "grid overflow-hidden transition-all duration-300",
                        mobileServicesOpen ? "grid-rows-[1fr] pb-4 opacity-100" : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <div className="min-h-0 border-l border-gold/30 pl-4">
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            aria-current={pathname === sub.href ? "page" : undefined}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-2.5 py-2.5 text-sm font-semibold text-white/75 hover:text-gold aria-[current=page]:text-gold"
                          >
                            <sub.icon className="h-4 w-4 text-gold/80" />
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </li>
                );
              }

              const active = isRouteActive(item);
              return (
                <li key={item.id} className="border-b border-white/10">
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "group flex items-center justify-between py-4 transition-colors",
                      active ? "text-gold" : "text-white/95 hover:text-gold",
                    )}
                  >
                    <span className="font-display text-2xl font-bold tracking-tight">{item.label}</span>
                    <ChevronRight className="h-5 w-5 text-gold/70 transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-white/10 px-5 py-5">
          <Button
            asChild
            variant="gold"
            size="lg"
            className="w-full rounded text-sm font-extrabold uppercase text-[#061626] shadow-[0_0_22px_rgba(245,178,61,0.38)]"
          >
            <Link href={quoteHref} onClick={() => setMobileOpen(false)}>
              Request a Quote
            </Link>
          </Button>

          <SocialRow size="h-11 w-11" iconSize="h-5 w-5" gap="gap-3" className="mt-5 justify-center" />
        </div>
      </div>
    </header>
  );
}
