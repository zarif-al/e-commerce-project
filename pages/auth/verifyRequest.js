import React from "react";
import styles from "../../styles/authentication/verifyRequest.module.css";
function verifyRequest() {
  return (
    <div className={styles.mainDiv}>
      <div className={styles.header}> Check your email ! </div>
      <div className={styles.subHeader}>
        A sign in link has been sent to your email address.
      </div>
    </div>
  );
}

export default verifyRequest;
