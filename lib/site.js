export const SITE = {
  name: "Ramshel Global Trade",
  short: "Ramshel",
  tagline: "Connecting Global Markets Through Trusted Trade",
  description:
    "Reliable import and export solutions, quality products, competitive pricing and worldwide delivery support for businesses across international markets.",
  email: "ramshelglobaltrade@gmail.com",
  phone: "+91 9360969543",
  phoneHref: "tel:+919360969543",
  whatsapp: "9360969543",
  whatsappHref: "https://wa.me/9360969543",
  address: "21/3 Pilliyar Kovil Street Eachangadu, Kayar, Chengalpattu, Tamilnadu 603110",
  socials: {
    linkedin: "https://www.linkedin.com/in/nandhakumar-ramu-0882b5445?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    twitter: "https://x.com/RAMSHEL2026",
    facebook: "https://www.facebook.com/share/1EwuNiDrfA/",
    instagram: "https://www.instagram.com/ramshel_global.trade?vrfl=dzBwMzJjaHl3a3Vj",
  },
};

export function waLink(message) {
  return `${SITE.whatsappHref}?text=${encodeURIComponent(message)}`;
}
