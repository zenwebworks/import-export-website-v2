import { AdminProvider } from "@/components/admin/AdminProvider";

export const metadata = { title: "Administration", robots: { index: false, follow: false } };

export default function AdminLayout({ children }) {
  return <AdminProvider>{children}</AdminProvider>;
}
