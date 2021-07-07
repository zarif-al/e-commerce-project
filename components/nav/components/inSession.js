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
function inSession({ handleOverlay, session }) {
  /*   const [session, loading] = useSession(); */
  const [drop, setDrop] = useState(false);
  const changeDrop = () => {
    handleOverlay();
    setDrop(!drop);
  };
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
    <div>
      <div
        className={
          drop ? styles.backdrop + " " + styles.active : styles.backdrop
        }
        onClick={() => {
          handleOverlay();
          changeDrop();
        }}
      ></div>
      <a
        className={styles.sidebar_btn}
        onClick={changeDrop}
        style={{ zIndex: drop ? 5 : 1 }}
      >
        {session.user.image ? (
          <img src={session.user.image} className={styles.userImage}></img>
        ) : (
          <FontAwesomeIcon icon={faUser} color="black" size="sm" />
        )}
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
  );
}

export default inSession;
