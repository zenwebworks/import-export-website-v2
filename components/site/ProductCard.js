import Link from "next/link";
import { Package2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "./products-catalogue.module.css";

export function ProductGrid({ products }) {
  return (
    <div className={styles.productGrid}>
      {products.map((product) => <ProductCard key={product.id} product={product} />)}
    </div>
  );
}

export function ProductCard({ product }) {
  const href = `/products/${product.slug}`;

  return (
    <article className={styles.productCard}>
      <Link href={href} className={styles.imageLink} aria-label={`View ${product.name}`}>
        {product.image_url ? (
          <img
            src={product.image_url}
            alt=""
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className={styles.imageFallback}>
            <Package2 aria-hidden="true" />
          </span>
        )}
      </Link>
      <h3 className={styles.productName}>{product.name}</h3>
      <Button asChild variant="navy" className={styles.viewLink}>
        <Link href={href} aria-label={`View products: ${product.name}`}>
          View Products
        </Link>
      </Button>
    </article>
  );
}
