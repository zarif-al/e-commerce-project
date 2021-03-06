import React from "react";
import styles from "/styles/nav/components/Sidebar.module.css";
import Categories from "./categories";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { useState } from "react";
function SideNav({ categories, handleOverlay }) {
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
  //motion framer settings
  const slideOut = {
    visible: {
      left: 0,
      transition: { duration: 0.3 },
    },
    hidden: {
      left: "-100%",
      transition: { duration: 0.3 },
    },
  };
  if (categories != null) {
    return (
      <div>
        <div
          className={
            sidebar ? styles.backdrop + " " + styles.active : styles.backdrop
          }
          onClick={() => {
            handleOverlay();
            showSidebar();
          }}
        ></div>
        <a
          className={styles.side_btn}
          style={{ zIndex: sidebar ? 5 : 1 }}
          onClick={() => {
            handleOverlay();
            showSidebar();
          }}
        >
          <FontAwesomeIcon icon={faBars} color="white" />
        </a>
        <motion.div
          className={styles.slider}
          initial={"hidden"}
          animate={sidebar ? "visible" : "hidden"}
          variants={slideOut}
        >
          <ul className={styles.navMenuItems}>
            <Categories
              categories={categories}
              subNav={false}
              showSidebar={showSidebar}
              handleOverlay={handleOverlay}
            />
          </ul>
        </motion.div>
      </div>
    );
  } else {
    return <div></div>;
  }
}

export default SideNav;
