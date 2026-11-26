import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "./export-packaging.module.css";

export function ExportPackaging() {
  const options = [
    "Branding & label design",
    "Retail pouches & jars",
    "Bulk cartons & sacks",
    "Material & size options",
  ];

  return (
    <section id="custom-packaging" aria-labelledby="custom-packaging-title" className={styles.packagingSection}>
      <div className={styles.packagingPanel}>
        <div className={styles.packagingContent}>
          <p className={styles.eyebrow}>Packaging & private label</p>
          <h2 id="custom-packaging-title" className={styles.packagingTitle}>
            Your product.<br />Your brand. Your packaging.
          </h2>
          <p className={styles.packagingDescription}>
            From a retail shelf to a bulk shipment, the right pack makes a
            difference. Let&apos;s plan a packaging format around your product and your market.
          </p>
          <ul className={styles.packagingOptions}>
            {options.map((option) => (
              <li key={option}><CheckCircle2 aria-hidden="true" /><span>{option}</span></li>
            ))}
          </ul>
          <Button asChild variant="navy" className={styles.bannerButton}>
            <Link href="/request-a-quote">Discuss custom packaging <ArrowRight aria-hidden="true" /></Link>
          </Button>
          <p className={styles.packagingNote}>Tell us your pack size, quantity and destination.</p>
        </div>
        <div className={styles.packagingArtwork}>
          <Image
            src="/assets/ramshel-export-packaging.webp"
            alt="Ramshel Global Trade navy and kraft pouches, spice jar, branded cartons and rice sack"
            width={1535}
            height={1024}
            sizes="(max-width: 767px) 94vw, (max-width: 1279px) 50vw, 620px"
          />
        </div>
      </div>
    </section>
  );
}

