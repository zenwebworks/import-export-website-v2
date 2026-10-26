import styles from "./country-flag.module.css";

// The adjacent country name labels the flag for assistive technology.
export function CountryFlag({ market }) {
  return (
    <img
      src={market.flag}
      alt=""
      aria-hidden="true"
      width={28}
      height={21}
      className={styles.flag}
    />
  );
}
