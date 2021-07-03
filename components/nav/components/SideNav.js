import React from "react";
import styles from "/styles/nav/components/Sidebar.module.css";
import Categories from "./categories";
function SideNav({ categories, sidebar, showSidebar, handleOverlay }) {
  /*   if (process.browser) {
    //Disable Body Scroll when side filter active
    sidebar ? disableBodyScroll(document) : enableBodyScroll(document);
  } */
  if (categories != null) {
    return (
      <div id="sideNav">
        <div
          className={
            sidebar ? styles.backdrop + " " + styles.active : styles.backdrop
          }
          onClick={() => {
            handleOverlay();
            showSidebar();
          }}
        ></div>
        <nav
          className={
            sidebar ? styles.navMenu + " " + styles.active : styles.navMenu
          }
        >
          <ul className={styles.navMenuItems}>
            <Categories
              categories={categories}
              subNav={false}
              showSidebar={showSidebar}
              handleOverlay={handleOverlay}
            />
          </ul>
        </nav>
      </div>
    );
  } else {
    return <></>;
  }
}

export default SideNav;
