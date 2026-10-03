import { MessageCircle } from "lucide-react";
import { SITE, waLink } from "@/lib/site";

export function WhatsAppButton({ message }) {
  return (
    <a
      href={waLink(message ?? "Hello, I'd like to know more about your export products.")}
      target="_blank"
      rel="noopener"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-elevated transition-transform hover:scale-105 active:scale-95"
    >
      <MessageCircle className="h-6 w-6" fill="white" />
      <span className="sr-only">WhatsApp {SITE.short}</span>
    </a>
  );
}
