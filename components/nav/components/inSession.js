import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn, signOut, useSession } from "next-auth/client";
import {
  faSignOutAlt,
  faListAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import styles from "../../../styles/nav/components/InSession.module.css";
import { useState } from "react";
import { motion } from "framer-motion";
function inSession() {
  const [drop, setDrop] = useState(false);
  const changeDrop = () => setDrop(!drop);
  const dropdown = {
    visible: {
      right: 0,
      transition: { duration: 0.3 },
    },
    hidden: {
      right: "-100%",
      transition: { duration: 0.3 },
    },
  };
  return (
    <>
      <div className={styles.acc_sidebar}>
        <a className={styles.sidebar_btn} onClick={changeDrop}>
          <FontAwesomeIcon icon={faUser} color="black" size="lg" />
        </a>
        <motion.div
          id="myDropdown"
          className={styles.dropdownContent}
          initial={"hidden"}
          animate={drop ? "visible" : "hidden"}
          variants={dropdown}
        >
          <motion.ul className={styles.accMenuList}>
            {/*  <li>
              <FontAwesomeIcon icon={faIdBadge} color="black" size="sm" />{" "}
              Profile
            </li> */}
            <li>
              <FontAwesomeIcon icon={faListAlt} color="black" size="sm" /> My
              Orders
            </li>
            <hr className={styles.listDivider} />
            <li
              onClick={() => {
                signOut();
              }}
            >
              <FontAwesomeIcon icon={faSignOutAlt} color="black" size="sm" />
              Sign Out
            </li>
          </motion.ul>
        </motion.div>
      </div>
    </>
  );
}

export default inSession;
