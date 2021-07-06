import { motion } from "framer-motion";
import React from "react";
import styles from "../../styles/nav/SubNav.module.css";
import Categories from "./components/categories";
function SubNav({ categories }) {
  const subNav = {
    visible: {
      transition: { duration: 0.4 },
      height: "auto",
      opacity: 1,
    },
    hidden: {
      height: 0,
      opacity: 0,
    },
  };

  if (categories != null) {
    return (
      <motion.header
        className={styles.navContainer}
        variants={subNav}
        initial="hidden"
        animate="visible"
      >
        <div>
          <motion.nav className={styles.custom_nav}>
            <ul className={styles.categoryList}>
              <Categories
                categories={categories}
                subNav={true}
                showSidebar={null}
              />
            </ul>
          </motion.nav>
        </div>
      </motion.header>
    );
  } else {
    return <></>;
  }
}
export default SubNav;
