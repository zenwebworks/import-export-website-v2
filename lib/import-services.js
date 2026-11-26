import chemicalsPhoto from "@/public/assets/import-category-chemicals.webp";
import consumerGoodsPhoto from "@/public/assets/import-category-consumer.webp";

export const IMPORT_CATEGORIES = [
  { slug: "machinery", name: "Machinery & Equipment", image: "/assets/import-category-machinery.webp", alt: "Yellow and navy manufacturing equipment in a modern factory" },
  { slug: "electronics", name: "Electronics & Components", image: "/assets/import-category-electronics.webp", alt: "Circuit boards, microchips and electronic components" },
  { slug: "raw-materials", name: "Raw Materials", image: "/assets/import-category-raw-materials.webp", alt: "Rolled steel coils stored in an industrial warehouse" },
  { slug: "chemicals", name: "Chemicals", image: chemicalsPhoto.src, alt: "Chemical powders, granules and liquid samples beside safety goggles and gloves" },
  { slug: "industrial", name: "Industrial Products", image: "/assets/import-category-industrial.webp", alt: "Precision gears, bearings and machined steel components" },
  { slug: "consumer", name: "Consumer Goods", image: consumerGoodsPhoto.src, alt: "Kitchen appliances, tableware, luggage, electronics and toys" },
];

export { TRADE_MARKETS as IMPORT_MARKETS } from "./markets.js";
