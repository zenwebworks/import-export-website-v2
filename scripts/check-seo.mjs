import nextEnv from "@next/env";
nextEnv.loadEnvConfig(process.cwd(), false);
try {
  const { IS_PUBLIC_SITE } = await import("../lib/seo.js");
  if (!IS_PUBLIC_SITE) throw new Error("Set NEXT_PUBLIC_SITE_URL to the confirmed production HTTPS origin before deployment. Localhost is intentionally noindex.");
  console.log("Production SEO origin configured. Rebuild after changing NEXT_PUBLIC_SITE_URL.");
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
