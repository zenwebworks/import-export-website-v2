export const SITE = {
  name: "Ramshel Global Trade",
  short: "Ramshel",
  tagline: "Connecting Global Markets Through Trusted Trade",
  description:
    "Reliable import and export solutions, quality products, competitive pricing and worldwide delivery support for businesses across international markets.",
  email: "ramshelenterprises@gmail.com",
  phone: "+91 9360969543",
  phoneHref: "tel:+919360969543",
  whatsapp: "9360969543",
  whatsappHref: "https://wa.me/9360969543",
  address: "21/3 Pilliyar Kovil Street Eachangadu, Kayar, Chengalpattu, Tamilnadu 603110",
  hours: "Mon - Sat | 9:00 - 18:00 (GMT)",
  socials: {
    linkedin: "#",
    twitter: "#",
    facebook: "#",
    instagram: "#",
  },
};

export function waLink(message) {
  return `${SITE.whatsappHref}?text=${encodeURIComponent(message)}`;
}
