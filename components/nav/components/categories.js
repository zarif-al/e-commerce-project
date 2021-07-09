import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Cookie from "js-cookie";
function categories({ categories, subNav, showSidebar, handleOverlay }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  //Regex to replace underscores
  const regex = /_/g;
  //
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
      <li
        key={category.category}
        onClick={!subNav ? () => setCategory(category.category) : null}
        onMouseEnter={subNav ? () => setCategory(category.category) : null}
        onMouseLeave={subNav ? () => setCategory(null) : null}
      >
        <div>
          <a
            style={{
              color:
                selectedCategory === category.category ? "#EF4A23" : "black",
              transition: "1000",
            }}
          >
            {category.category.replace(regex, " ")}
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
        </div>
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
      </li>
    );
  });

  return <>{navItemArray}</>;
}

export default categories;
