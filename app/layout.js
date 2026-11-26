import { withSocialMetadata } from "@/lib/social";
import { SITE_URL, IS_PUBLIC_SITE } from "@/lib/seo";
import "./globals.css";
import { AppShell } from "@/components/site/AppShell";
import { SITE } from "@/lib/site";

export const metadata = withSocialMetadata({
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE.name} - Import & Export Solutions`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  robots: IS_PUBLIC_SITE ? { index: true, follow: true } : { index: false, follow: false },
  authors: [{ name: SITE.name }],
  icons: {
    icon: [
      { url: "/favicon.ico?v=gold-wolf", sizes: "16x16 32x32 48x48 64x64", type: "image/x-icon" },
      { url: "/icons/wolf-192.png?v=gold-wolf", sizes: "192x192", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png?v=gold-wolf", sizes: "180x180", type: "image/png" },
  },
  openGraph: {
    siteName: SITE.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
