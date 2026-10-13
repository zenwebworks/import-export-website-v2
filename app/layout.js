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
