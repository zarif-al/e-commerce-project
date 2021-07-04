import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn, signOut, useSession } from "next-auth/client";
import {
  faSignOutAlt,
  faListAlt,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import useSWR from "swr";
import styles from "../../../styles/nav/components/Cart.module.css";
import { useState } from "react";
import { motion } from "framer-motion";
import Spinner from "react-bootstrap/Spinner";
import { itemCount } from "../../../functions/functions";
function Cart() {
  const fetcher = (url) => fetch(url).then((r) => r.json());
  const { data, error, isValidating } = useSWR("/api/cartApi", fetcher);
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
          <span className="fa-layers fa-fw">
            <FontAwesomeIcon icon={faShoppingCart} color="black" />
            <span
              className="fa-layers-counter fa-layers-top"
              style={{ fontSize: "2rem" }}
            >
              {isValidating || data === undefined ? (
                <Spinner animation="border" style={{ marginBottom: "1rem" }} />
              ) : (
                itemCount(data)
              )}
            </span>
          </span>
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

export default Cart;
