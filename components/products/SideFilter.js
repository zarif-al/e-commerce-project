import React from "react";
import styles from "../../styles/products/components/SideFilter.module.css";
import ProductFilter from "./ProductFilter";
//Fix Styling
function SideFilter({
  handleFilter,
  showSideFilter,
  setSliderMaxPrice,
  setSliderMinPrice,
  setUserMaxPrice,
  setUserMinPrice,
  brands_object,
  selected_brands,
  handleChecklist,
  sliderMaxPrice,
  sliderMinPrice,
  minPrice,
  maxPrice,
  disabledBrand,
}) {
  return (
    <>
      <div
        className={
          showSideFilter
            ? styles.backdrop + " " + styles.active
            : styles.backdrop
        }
        onClick={() => {
          handleFilter();
        }}
      ></div>
      <div
        className={
          showSideFilter
            ? styles.filterMenu + " " + styles.active
            : styles.filterMenu
        }
      >
        <ProductFilter
          setSliderMaxPrice={setSliderMaxPrice}
          setSliderMinPrice={setSliderMinPrice}
          setUserMaxPrice={setUserMaxPrice}
          setUserMinPrice={setUserMinPrice}
          brands_object={brands_object}
          selected_brands={selected_brands}
          handleChecklist={handleChecklist}
          sliderMinPrice={sliderMinPrice}
          sliderMaxPrice={sliderMaxPrice}
          minPrice={minPrice}
          maxPrice={maxPrice}
          disabledBrand={disabledBrand}
        />
      </div>
    </>
  );
}

export default SideFilter;
