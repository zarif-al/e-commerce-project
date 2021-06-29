import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn, signOut, useSession } from "next-auth/client";
import {
  faShoppingCart,
  faSignOutAlt,
  faSignInAlt,
  faListAlt,
  faIdBadge,
} from "@fortawesome/free-solid-svg-icons";
import styles from "../../../styles/InSession.module.css";
import { useState } from "react";
import { motion, AnimateSharedLayout } from "framer-motion";
function inSession() {
  const [session, loading] = useSession();
  const [drop, setDrop] = useState(false);
  const changeDrop = () => setDrop(!drop);
  const dropdown = {
    visible: {
      right: 0,
      transition: { duration: 0.1 },
    },
    hidden: {
      right: "-100%",
      transition: { duration: 0.1 },
    },
  };
  return (
    <>
      <motion.div className={styles.acc_sidebar}>
        <a href="#" className={styles.sidebar_btn} onClick={changeDrop}>
          <img
            /*   src={session.user.image ? session.user.image : "/defaultIcon.png"} */
            src="/defaultIcon.png"
            style={{ height: "20px", width: "20px" }}
          ></img>{" "}
          {/*  {session.user.name ? session.user.name : "Account"} */}
        </a>
        <motion.div
          id="myDropdown"
          className={styles.dropdownContent}
          initial={"hidden"}
          animate={drop ? "visible" : "hidden"}
          variants={dropdown}
        >
          <motion.ul className={styles.accMenuList}>
            <li>
              <FontAwesomeIcon icon={faIdBadge} color="black" size="sm" />{" "}
              Profile
            </li>
            <li>
              <FontAwesomeIcon icon={faListAlt} color="black" size="sm" /> My
              Orders
            </li>
            <li>
              <FontAwesomeIcon icon={faSignOutAlt} color="black" size="sm" />
              Sign Out
            </li>
          </motion.ul>
        </motion.div>
      </motion.div>
    </>
  );
}

export default inSession;
