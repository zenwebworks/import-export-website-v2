import { SITE } from "@/lib/site";

export default function manifest() {
  return {
    name: SITE.name,
    short_name: SITE.short,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0b1721",
    icons: [
      { src: "/icons/wolf-192.png?v=gold-wolf", sizes: "192x192", type: "image/png" },
      { src: "/icons/wolf-512.png?v=gold-wolf", sizes: "512x512", type: "image/png" },
      { src: "/icons/wolf-maskable-512.png?v=gold-wolf", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
