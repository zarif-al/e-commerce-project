import React from "react";
import styles from "/styles/Sidebar.module.css";
import { useState } from "react";
import Categories from "./categories";
import { motion, AnimateSharedLayout } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
function SideNav({ categories, sidebar, showSidebar }) {
  if (categories != null) {
    return (
      <>
        <div
          className={
            sidebar ? styles.backdrop + " " + styles.active : styles.backdrop
          }
          onClick={() => {
            showSidebar(!sidebar);
          }}
        ></div>
        <nav
          className={
            sidebar ? styles.navMenu + " " + styles.active : styles.navMenu
          }
        >
          <ul className={styles.navMenuItems}>
            <Categories categories={categories} subNav={false} />
          </ul>
        </nav>
      </>
    );
  } else {
    return <></>;
  }
}

export default SideNav;
