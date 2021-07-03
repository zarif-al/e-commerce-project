import React from "react";
import styles from "../../styles/products/components/ProductFilter.module.css";
import Form from "react-bootstrap/Form";
import { Range } from "rc-slider";
import "rc-slider/assets/index.css";
function ProductFilter({
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
      <div className={styles.priceRange}>
        <h6>Price Range</h6>
        <hr className={styles.divider} />
        <Range
          className={styles.rangeSlider}
          min={minPrice}
          max={maxPrice}
          value={[sliderMinPrice, sliderMaxPrice]}
          onChange={(value) => {
            setSliderMinPrice(value[0]);
            setSliderMaxPrice(value[1]);
          }}
          onAfterChange={(value) => {
            setUserMinPrice(value[0]);
            setUserMaxPrice(value[1]);
          }}
        />
        <div className={styles.rangeInput}>
          <Form.Control
            type="number"
            min={1}
            className={styles.priceInput}
            onChange={(e) => {
              setSliderMinPrice(parseInt(e.target.value));
            }}
            onBlur={(e) => {
              setUserMinPrice(parseInt(e.target.value));
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (
                  parseInt(e.target.value) >= minPrice &&
                  parseInt(e.target.value) <= maxPrice
                ) {
                  setUserMaxPrice(parseInt(e.target.value));
                }
              }
            }}
            onWheel={(e) => {
              e.target.blur();
            }}
            value={sliderMinPrice}
            isInvalid={
              Number(sliderMinPrice) < minPrice
                ? true
                : Number(sliderMinPrice) > maxPrice
                ? true
                : false
            }
          />
          <Form.Control
            type="number"
            min={1}
            className={styles.priceInput}
            onChange={(e) => {
              setSliderMaxPrice(parseInt(e.target.value));
            }}
            onBlur={(e) => {
              setUserMaxPrice(parseInt(e.target.value));
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (
                  parseInt(e.target.value) >= minPrice &&
                  parseInt(e.target.value) <= maxPrice
                ) {
                  setUserMaxPrice(parseInt(e.target.value));
                }
              }
            }}
            onWheel={(e) => {
              e.target.blur();
            }}
            value={sliderMaxPrice}
            isInvalid={
              Number(sliderMaxPrice) > maxPrice
                ? true
                : Number(sliderMaxPrice) < minPrice
                ? true
                : false
            }
          />
        </div>
      </div>
      <div className={styles.brands}>
        <h6>Brands</h6>
        <hr className={styles.divider} />
        <div className={styles.brandsChecklist}>
          <div>
            <input
              className={styles.checkbox}
              type="checkbox"
              id="All"
              checked={
                selected_brands.length === brands_object.brand.length
                  ? true
                  : false
              }
              onChange={() => handleChecklist("All")}
            />
            <label className={styles.label} htmlFor="All">
              All
            </label>
          </div>
          {brands_object.brand.map((brand, i) => {
            return (
              <div>
                <input
                  className={styles.checkbox}
                  type="checkbox"
                  id={brand}
                  checked={selected_brands.includes(brand) ? true : false}
                  onChange={() => handleChecklist(brand)}
                  disabled={disabledBrand === brand ? true : false}
                />
                <label className={styles.label} htmlFor={brand}>
                  {brand}
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default ProductFilter;
