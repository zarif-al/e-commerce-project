import React from "react";
import styles from "../../styles/layout/Footer.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhoneAlt, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import {
  faInstagram,
  faFacebookF,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
function Footer() {
  return (
    <div className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.supportSection}>
          <div>Support</div>
          <div className={styles.contactButton}>
            <div className={styles.icon}>
              <FontAwesomeIcon icon={faPhoneAlt} size="sm" />
            </div>
            <div className={styles.buttonRow}>
              <div className={styles.time}>9AM-8PM</div>
              <div className={styles.number}>09699002003</div>
            </div>
          </div>
          <div className={styles.contactButton}>
            <div className={styles.icon}>
              <FontAwesomeIcon icon={faEnvelope} size="sm" />
            </div>
            <div className={styles.buttonRow}>
              <div className={styles.email}>demo@xyz.com</div>
            </div>
          </div>
        </div>
        <div className={styles.aboutSection}>
          <div>About Us</div>
          <div className={styles.aboutColumns}>
            <div className={styles.col1}>
              <p>EMI</p>
              <p>Privacy Policy</p>
              <p>Career</p>
              <p>Blog</p>
            </div>
            <div className={styles.col1}>
              <p>About Us</p>
              <p>Terms and Conditions</p>
              <p>Write For Us</p>
              <p>Brands</p>
            </div>
            <div className={styles.col1}>
              <p>Online Delivery</p>
              <p>Refund and Return Policy</p>
              <p>Contact Us</p>
            </div>
          </div>
        </div>
        <div className={styles.addressSection}>
          <div>Ecommerce Demo</div>
          <div>
            <p>
              4/22, Salimullah road, Mohammadpur, <br /> Dhaka-1207
            </p>
          </div>
          <div className={styles.contactIcons}>
            <div>
              <FontAwesomeIcon icon={faFacebookF} color="black" size="lg" />
            </div>
            <div>
              <FontAwesomeIcon icon={faInstagram} color="black" size="lg" />
            </div>
            <div>
              <FontAwesomeIcon icon={faYoutube} color="black" size="lg" />
            </div>
          </div>
        </div>
      </div>
      <hr className={styles.footerDivider} />
      <div className={styles.footerBottom}>
        <div>&copy; 2021 Ecommerce Demo | All Rights Reserved</div>
      </div>
    </div>
  );
}

export default Footer;
