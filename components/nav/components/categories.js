import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Cookie from "js-cookie";
function categories({ categories, subNav, showSidebar, handleOverlay }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const setCategory = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  const dropdown = {
    visible: {
      height: "auto",
      transition: { duration: 0.15 },
      display: "block",
    },
    hidden: {
      transitionEnd: {
        display: "none",
      },
      height: 0,
      transition: { duration: 0.15 },
    },
  };

  const categories_button = {
    visible: {
      opacity: 1,
      transition: { duration: 0.3, delay: 0.6 },
    },
    hidden: {
      opacity: 0,
    },
  };

  const navItemArray = [];

  //Loop over categories
  categories.forEach((category) => {
    const navContentArray = [];
    navContentArray.push(
      <li key="all">
        <Link href={`/Products/Items/${category.category}`} passHref={true}>
          <a
            onClick={() => {
              Cookie.set("brand", "All", { sameSite: "strict" });
              if (!subNav) {
                showSidebar();
                handleOverlay();
              }
            }}
          >
            All
          </a>
        </Link>
      </li>
    );
    category.brand.forEach((brand) => {
      navContentArray.push(
        <li key={brand}>
          <Link href={`/Products/Items/${category.category}`} passHref={true}>
            <a
              onClick={() => {
                Cookie.set("brand", brand, { sameSite: "strict" });
                if (!subNav) {
                  showSidebar();
                  handleOverlay();
                }
              }}
            >
              {brand}
            </a>
          </Link>
        </li>
      );
    });

    //create a nav item
    navItemArray.push(
      <motion.li
        key={category.category}
        onClick={!subNav ? () => setCategory(category.category) : null}
        onMouseEnter={subNav ? () => setCategory(category.category) : null}
        onMouseLeave={subNav ? () => setCategory(null) : null}
      >
        <motion.div
          variants={categories_button}
          animate="visible"
          initial="hidden"
        >
          <a
            style={{
              color:
                selectedCategory === category.category ? "#EF4A23" : "black",
              transition: "1000",
            }}
          >
            {category.category}
          </a>
          {!subNav ? (
            selectedCategory === category.category ? (
              <FontAwesomeIcon icon={faMinus} color="black" size="sm" />
            ) : (
              <FontAwesomeIcon icon={faPlus} color="black" size="sm" />
            )
          ) : (
            ""
          )}
        </motion.div>
        <motion.div
          id="myDropdown"
          initial={"hidden"}
          animate={
            selectedCategory === category.category ? "visible" : "hidden"
          }
          variants={dropdown}
        >
          <motion.ul
            style={{ listStyle: "none", padding: "0", width: "fit-content" }}
          >
            {navContentArray}
          </motion.ul>
        </motion.div>
      </motion.li>
    );
  });

  return <>{navItemArray}</>;
}

export default categories;
