import Image from "next/image";
import { ArrowRight, ArrowUpRight, BriefcaseBusiness, Building2, Clock3, FileText, Globe2, Handshake, Headset, Mail, MapPin, Package, Phone, ShieldCheck, Ship } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp, FaYoutube } from "react-icons/fa6";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ContactForm } from "@/components/site/ContactForm";
import { SITE } from "@/lib/site";
import styles from "./contact.module.css";

export const metadata = {
  title: "Contact Us",
  description: `Contact ${SITE.name} for import and export enquiries, product sourcing, small business collaboration and global trade support.`,
  alternates: { canonical: "/contact" },
};

const companyName = "Ramshel Enterprises Pvt Ltd";
const website = "https://www.ramshelglobaltrade.com";
const whatsappHref = `https://wa.me/${SITE.phoneHref.replace(/\D/g, "")}`;
const mapQuery = encodeURIComponent(SITE.address);
const directionsHref = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

const contactChannels = [
  { icon: Phone, title: "Phone /", subtitle: "WhatsApp", href: whatsappHref, external: true },
  { icon: Mail, title: "Business", subtitle: "Email", href: `mailto:${SITE.email}` },
  { icon: Globe2, title: "Our", subtitle: "Website", href: website, external: true },
  { icon: Building2, title: "India", subtitle: "Office", href: "#location" },
  { icon: Globe2, title: "Global Trade", subtitle: "Support", href: "#business-enquiry" },
];

const socialChannels = [
  { icon: FaFacebookF, title: "Facebook", href: SITE.socials.facebook, color: "#244b91" },
  { icon: FaInstagram, title: "Instagram", href: SITE.socials.instagram, color: "linear-gradient(35deg, #f4aa37, #df3267 52%, #774cc5)" },
  { icon: FaLinkedinIn, title: "LinkedIn", href: SITE.socials.linkedin, color: "#0a71a8" },
  { icon: FaYoutube, title: "YouTube", href: SITE.socials.youtube, color: "#d91e24" },
  { icon: FaWhatsapp, title: "WhatsApp", href: whatsappHref, color: "#239b4a" },
];

const exportPoints = ["Manufacturers", "Suppliers", "Traders", "Agricultural producers", "Small businesses", "Emerging brands"];
const importPoints = ["Product requirement", "Quantity & quality", "Target price", "Product specification", "Packaging requirement", "Destination in India"];
const collaborationPoints = [
  "Small business export support", "International buyer connections", "Private label development",
  "Custom packaging & branding", "Market expansion support", "Documentation guidance",
  "Shipping & logistics support", "Wholesale & bulk opportunities",
];

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <div className="container-x">
        <header className={styles.intro}>
          <Breadcrumbs items={[{ label: "Contact Us" }]} />
          <div className={styles.introRow}>
            <div>
              <p className={styles.eyebrow}>LET’S TALK TRADE</p>
              <h1>Good business starts with <span>a conversation.</span></h1>
              <p className={styles.introText}>From your first enquiry to your next global opportunity, we’re here to help.</p>
            </div>
            <a href="#business-enquiry" className={styles.introLink}>
              Start a conversation <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </div>
        </header>

        <div className={styles.topGrid}>
          <section className={styles.panel} aria-labelledby="company-heading">
            <PanelHeading icon={Building2} id="company-heading">Company details</PanelHeading>
            <div className={styles.companyIdentity}>
              <p className={styles.companyBrand}>{SITE.name}</p>
              <p className={styles.companyLegal}>{companyName}</p>
            </div>
            <dl className={styles.details}>
              <Detail icon={BriefcaseBusiness} label="Business">Import | Export | Global Sourcing</Detail>
              <Detail icon={Globe2} label="Location">India</Detail>
              <Detail icon={Phone} label="Phone / WhatsApp"><a href={SITE.phoneHref}>{SITE.phone}</a></Detail>
              <Detail icon={Mail} label="Email"><a href={`mailto:${SITE.email}`}>{SITE.email}</a></Detail>
              <Detail icon={Globe2} label="Website">
                <a href={website} target="_blank" rel="noopener noreferrer">www.ramshelglobaltrade.com</a>
              </Detail>
              <Detail icon={MapPin} label="Office">
                <a href={directionsHref} target="_blank" rel="noopener noreferrer">{SITE.address}</a>
              </Detail>
            </dl>
          </section>

          <section id="business-enquiry" tabIndex={-1} className={`${styles.panel} ${styles.formPanel}`} aria-labelledby="enquiry-heading">
            <PanelHeading icon={FileText} id="enquiry-heading">Business enquiry</PanelHeading>
            <h3 className={styles.formSubtitle}>Tell us your requirement</h3>
            <p className={styles.panelDescription}>Have a product in mind or a business opportunity to share? Let’s take the next step.</p>
            <div className={styles.formWrapper}><ContactForm /></div>
            <p className={styles.formNote}><ShieldCheck size={16} aria-hidden="true" /> Your details are only used to respond to your enquiry.</p>
          </section>
        </div>

        <div className={styles.contentGrid}>
          <div className={styles.column}>
            <section className={`${styles.panel} ${styles.contactPanel}`} aria-labelledby="contact-heading">
              <PanelHeading icon={Headset} id="contact-heading">Contact information</PanelHeading>
              <p className={styles.panelDescription}>A direct connection to your next opportunity.</p>
              <div className={styles.channels}>
                {contactChannels.map(({ icon: Icon, title, subtitle, href, external }) => (
                  <a key={subtitle} href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className={styles.channel}>
                    <Icon className={styles.channelIcon} strokeWidth={1.6} aria-hidden="true" />
                    <span>{title}<br />{subtitle}</span>
                  </a>
                ))}
              </div>
              <div className={styles.socialSection}>
                <p className={styles.smallLabel}>CONNECT WITH US</p>
                <div className={styles.channels}>
                  {socialChannels.map(({ icon: Icon, title, href, color }) => {
                    const available = /^https?:\/\//.test(href || "");
                    const content = (
                      <>
                        <span className={styles.socialIcon} style={{ background: color }}><Icon size={21} aria-hidden="true" /></span>
                        <span>{title}</span>
                        {!available && <small>Not linked yet</small>}
                      </>
                    );
                    return available ? (
                      <a key={title} href={href} target="_blank" rel="noopener noreferrer" className={styles.socialChannel}>{content}</a>
                    ) : (
                      <span key={title} className={`${styles.socialChannel} ${styles.unavailable}`} aria-disabled="true">{content}</span>
                    );
                  })}
                </div>
              </div>
              <p className={styles.responseNote}><Clock3 size={15} aria-hidden="true" /> We usually reply within one business day.</p>
            </section>

            <section className={styles.panel} aria-labelledby="collaboration-heading">
              <PanelHeading icon={Handshake} id="collaboration-heading">Small business owner collaboration</PanelHeading>
              <p className={styles.panelDescription}>Your ambition. Our trade network. Let’s grow together.</p>
              <div className={styles.collaborationBody}>
                <PointList points={collaborationPoints} />
                <Image src="/assets/contact-collaboration.webp" alt="Navy and gold handshake illustration representing business collaboration" width={640} height={640} sizes="(max-width: 479px) 200px, (max-width: 899px) 35vw, 245px" className={styles.collaborationImage} />
              </div>
              <EnquiryLink>Collaborate with us</EnquiryLink>
            </section>
          </div>

          <div className={styles.column}>
            <TradePanel icon={Ship} id="export-heading" title="Export enquiries" subtitle="Export your products from India" points={exportPoints} image="/assets/contact-export.webp" imageAlt="Cargo ship carrying containers for international exports" action="Export with us" />
            <TradePanel icon={Package} id="import-heading" title="Import enquiries" subtitle="Source products from global markets" points={importPoints} image="/assets/contact-import.webp" imageAlt="Globe and shipping boxes representing global product sourcing" action="Import with us" />

            <section id="location" tabIndex={-1} className={`${styles.panel} ${styles.officePanel}`} aria-labelledby="office-heading">
              <PanelHeading icon={MapPin} id="office-heading">Office / location</PanelHeading>
              <div className={styles.officeLayout}>
                <div className={styles.officeBody}>
                  <MapPin className={styles.officePin} size={26} aria-hidden="true" />
                  <div>
                    <p className={styles.officeBrand}>{SITE.name}</p>
                    <p className={styles.officeLegal}>{companyName}</p>
                    <address>{SITE.address}</address>
                    <a href={directionsHref} target="_blank" rel="noopener noreferrer" className={styles.directionsLink}>Open in Google Maps <ArrowUpRight size={15} aria-hidden="true" /></a>
                  </div>
                </div>
                <div className={styles.map}>
                  <iframe title={`${SITE.name} office location in Tamil Nadu, India`} src={`https://maps.google.com/maps?q=${mapQuery}&z=14&output=embed`} width="600" height="200" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                </div>
              </div>
            </section>
          </div>
        </div>
        <p className={styles.closingNote}><Globe2 size={16} aria-hidden="true" /> Based in India. Connected to the world.</p>
      </div>
    </div>
  );
}

function PanelHeading({ icon: Icon, id, children }) {
  return (
    <div className={styles.panelHeading}>
      <span className={styles.headingIcon} aria-hidden="true">
        <Icon strokeWidth={1.8} />
      </span>
      <h2 id={id}>{children}</h2>
    </div>
  );
}

function Detail({ icon: Icon, label, children }) {
  return <div className={styles.detail}><dt><Icon size={18} strokeWidth={1.8} aria-hidden="true" /><span>{label}</span></dt><dd>{children}</dd></div>;
}

function PointList({ points }) {
  return <ul className={styles.points}>{points.map((point) => <li key={point}>{point}</li>)}</ul>;
}

function EnquiryLink({ children }) {
  return <a href="#business-enquiry" className={styles.enquiryLink}>{children}<ArrowRight size={15} aria-hidden="true" /></a>;
}

function TradePanel({ icon, id, title, subtitle, points, image, imageAlt, action }) {
  return (
    <section className={styles.panel} aria-labelledby={id}>
      <PanelHeading icon={icon} id={id}>{title}</PanelHeading>
      <h3 className={styles.tradeSubtitle}>{subtitle}</h3>
      <div className={styles.tradeBody}>
        <PointList points={points} />
        <Image src={image} alt={imageAlt} width={640} height={640} sizes="(max-width: 479px) 45vw, (max-width: 899px) 40vw, 235px" className={styles.tradeImage} />
      </div>
      <EnquiryLink>{action}</EnquiryLink>
    </section>
  );
}

