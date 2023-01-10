import React from "react";
import { Link } from "react-router-dom";
import styles from "./css/Footer.module.css";

const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.top}>
          <div className={styles.top_left}>
            <img src="/recipapa-logo.svg" alt="logo" />
            <p>
              Fastest recipe search app to find food recipe. Share your recipe
              with the world!
            </p>
          </div>

          <div className={styles.top_right}>
            <p className={styles.sub_heading}>Get in Touch</p>
            <a href="https://www.anantabipal.dev"target="_blank">www.anantabipal.dev</a>
          </div>
        </div>

        <hr />
        <div className={styles.bottom}>
          <p>All Rights Researved &#64; Ananta Bipal Subedi</p>
          <p>Developed in Jan, 2023</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
