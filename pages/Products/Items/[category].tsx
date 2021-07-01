import React, { useState, useEffect } from "react";
import { connectToDatabase } from "../../../utils/mongodb";
import Image from "next/image";
import Button from "react-bootstrap/Button";
import { Container, Row, Col } from "react-bootstrap";
import { Range } from "rc-slider";
import Card from "react-bootstrap/Card";
import styles from "../../../styles/AllProducts.module.css";
import "rc-slider/assets/index.css";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faEdit } from "@fortawesome/free-solid-svg-icons";
import Cookie from "js-cookie";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import Link from "next/link";
function Items({ items, category, brands }) {
  //Version 1 -> Switch to using fetch and mongo skip() for pagination.
  //Add a way to set Upcoming items to show or not
  //parse props
  const items_object = JSON.parse(items); //change
  const brands_object = JSON.parse(brands);
  //get cookie
  let cookieBrand = Cookie.get("brand");
  //initialize default state
  let defaultState = {};
  if (cookieBrand === "All") {
    defaultState["All"] = 1;
  } else if (cookieBrand === undefined) {
    defaultState["All"] = 1;
  } else {
    defaultState["All"] = 0;
  }
  //set values for default state
  brands_object.brand.forEach((brand, i) => {
    if (
      cookieBrand === "All" ||
      cookieBrand === brand ||
      cookieBrand === undefined
    ) {
      defaultState[brand] = 1;
    } else {
      defaultState[brand] = 0;
    }
  });
  //Brand states
  const [selected_brands, setBrands] = useState(defaultState);
  const [disabledBrand, setDisabledBrand] = useState(null);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [userMinPrice, setUserMinPrice] = useState(0);
  const [userMaxPrice, setUserMaxPrice] = useState(0);
  const [firstFilter, setFirstFilter] = useState(null); //change
  const [secondFilter, setSecondFilter] = useState(null); //change
  const [showLimit, setShowLimit] = useState(24);
  const [page, setPage] = useState([1, 20]);
  const [sort, setSort] = useState(1);
  const [loading, setLoading] = useState(true);
  //
  //console.log(selected_brands);
  //
  useEffect(() => {
    //find disabled checkbox
    let sum = 0;
    let latestKey = null;
    for (const [key, value] of Object.entries(selected_brands)) {
      if (value === 1) {
        sum += 1;
        latestKey = key;
      }
    }
    if (sum === 1) {
      setDisabledBrand(latestKey);
    } else {
      setDisabledBrand(null);
    }
    //Filter Items on category //change
    const currentFilter = items_object.filter((item) => {
      if (selected_brands[item.brand] === 1) {
        return item;
      }
    });
    //set prices
    setFirstFilter(currentFilter); //change
    setMinPrice(currentFilter[0].price); //change
    setUserMinPrice(currentFilter[0].price); //change
    setMaxPrice(currentFilter[currentFilter.length - 1].price); //change
    setUserMaxPrice(currentFilter[currentFilter.length - 1].price); //change
  }, [selected_brands]);
  //update brand state when brands object changes
  useEffect(() => {
    setLoading(true);
    setFirstFilter(null); //change
    setSecondFilter(null); //change
    setBrands(defaultState);
  }, [brands]);
  //update second filter when user price range changes
  useEffect(() => {
    if (firstFilter != null) {
      setLoading(true); //change
      const priceFilter = firstFilter.filter((item) => {
        if (item.price >= userMinPrice && item.price <= userMaxPrice) {
          return item;
        }
      });
      /*       //Pagination
      const pageArray = [];
      const startIndex = page[0] * page[1] - page[1];
      const endIndex = page[0] * page[1];
      for (var i = startIndex; i < endIndex; i++) {
        pageArray.push(priceFilter[i]);
      }
      //Price Sort
      const priceSort = pageArray */
      setSecondFilter(priceFilter);
      setLoading(false);
    }
  }, [userMinPrice, userMaxPrice, page, sort]);
  //checkList state manager
  const handleChecklist = (selection) => {
    if (selection === "All") {
      let newObject = {};
      newObject["All"] = 1;
      brands_object.brand.forEach((brand, i) => {
        newObject[brand] = 1;
      });
      setBrands({ ...newObject });
    } else {
      if (selected_brands[selection] === 1) {
        var selection_copy = selected_brands;
        selection_copy["All"] = 0;
        selection_copy[selection] = 0;
        setBrands({ ...selection_copy });
      } else {
        var selection_copy = selected_brands;
        selection_copy["All"] = 0;
        selection_copy[selection] = 1;
        setBrands({ ...selection_copy });
      }
    }
  };

  return (
    <>
      <Container fluid className={styles.mainContainer}>
        <Row>
          <Col className={styles.menuCol} lg={3}>
            <div className={styles.priceRange}>
              <h6>Price Range</h6>
              <hr className={styles.divider} />
              <Range
                className={styles.rangeSlider}
                min={minPrice}
                max={maxPrice}
                value={[userMinPrice, userMaxPrice]}
                onChange={(value) => {
                  setUserMinPrice(value[0]);
                  setUserMaxPrice(value[1]);
                }}
              />
              <div className={styles.rangeInput}>
                <Form.Control
                  type="number"
                  min={1}
                  className={styles.quantityInput}
                  onChange={(e) => {
                    setUserMinPrice(parseInt(e.target.value));
                  }}
                  onWheel={(e) => {
                    e.target.blur();
                  }}
                  value={userMinPrice}
                  isInvalid={Number(userMinPrice) < minPrice ? true : false}
                />
                <Form.Control
                  type="number"
                  min={1}
                  className={styles.quantityInput}
                  onChange={(e) => {
                    setUserMaxPrice(parseInt(e.target.value));
                  }}
                  onWheel={(e) => {
                    e.target.blur();
                  }}
                  value={userMaxPrice}
                  isInvalid={Number(userMaxPrice) > maxPrice ? true : false}
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
                    checked={selected_brands["All"] === 1 ? true : false}
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
                        checked={selected_brands[brand] === 1 ? true : false}
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
          </Col>
          <Col className={styles.productsCol} lg={9}>
            <Row className={styles.productCol_firstRow}>
              <Breadcrumb className={styles.breadcrumb_custom}>
                <Breadcrumb.Item href="/">
                  <FontAwesomeIcon icon={faHome} color="black" />
                </Breadcrumb.Item>
                <Breadcrumb.Item href="https://getbootstrap.com/docs/4.0/components/breadcrumb/">
                  {category}
                </Breadcrumb.Item>
              </Breadcrumb>
              <div className={styles.viewOptions}>
                <div className={styles.showDiv}>
                  <label htmlFor="show">Show: </label>
                  <select name="show" id="show">
                    <option value="20">20</option>
                    <option value="24">24</option>
                    <option value="48">48</option>
                    <option value="75">75</option>
                    <option value="90">90</option>
                  </select>
                </div>
                <div className={styles.sortDiv}>
                  <label htmlFor="sort">Sort: </label>
                  <select name="sort" id="sort">
                    <option value="1">Price (Low {`>`} High)</option>
                    <option value="-1">Price (Hight {`>`} Low)</option>
                  </select>
                </div>
              </div>
            </Row>
            <Row className={styles.items}>
              {/*   This will be the loader when using fetch */}
              {loading == true ? (
                <div className={styles.loader}>
                  <Spinner animation="border" />
                </div>
              ) : (
                secondFilter.map((item, i) => {
                  return (
                    <Col lg={3} className={styles.itemCol}>
                      <Link
                        href={`/Products/Item/${item.category}/${item.name}`}
                        passHref={true}
                      >
                        <a className={styles.cardLink}>
                          <Card className={styles.card}>
                            <Card.Img
                              variant="top"
                              src={item.imageLink}
                              className={styles.cardImage}
                            />
                            <Card.Body className={styles.cardBody}>
                              <Card.Title className={styles.cardTitle}>
                                {item.name}
                              </Card.Title>
                              <Card.Text className={styles.descriptionList}>
                                <ul>
                                  {item.description.map((desc, i) => {
                                    return <li key={i}>{desc}</li>;
                                  })}
                                </ul>
                              </Card.Text>
                              <Card.Text className={styles.footer}>
                                {item.price > 0 ? item.price + "৳" : "Upcoming"}
                                <Button variant="outline-primary" block>
                                  Buy Now
                                </Button>
                              </Card.Text>
                            </Card.Body>
                          </Card>
                        </a>
                      </Link>
                    </Col>
                  );
                })
              )}
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Items;

export async function getStaticPaths() {
  const { db } = await connectToDatabase();
  const data = await db
    .collection("Categories")
    .find()
    .project({ _id: 0, category: 1 })
    .toArray();

  if (!data) {
    return {
      notFound: true,
    };
  }
  const paths = data.map((item) => {
    return {
      params: {
        category: item.category,
      },
    };
  });
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { db } = await connectToDatabase();
  const Items = await db
    .collection("Items")
    .find({ category: params.category })
    .sort({ price: 1 })
    .toArray();
  const Brands = await db
    .collection("Categories")
    .find({ category: params.category })
    .project({ _id: 0, brand: 1 })
    .toArray();
  if (!Items) {
    return {
      notFound: true,
    };
  }
  var items = JSON.stringify(Items);
  var brands = JSON.stringify(Brands[0]);
  return {
    props: { items, category: params.category, brands },
    revalidate: 600,
  };
}
