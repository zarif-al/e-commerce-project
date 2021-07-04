import React, { useState, useEffect } from "react";
import { connectToDatabase } from "../../../utils/mongodb";
import Button from "react-bootstrap/Button";
import { Container, Row, Col } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import styles from "../../../styles/products/Products.module.css";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faArrowCircleLeft,
  faArrowCircleRight,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import Cookie from "js-cookie";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import Link from "next/link";
import ProductFilter from "../../../components/products/ProductFilter";
import SideFilter from "../../../components/products/SideFilter";
import { cartAction } from "../../../functions/functions";
import Toast from "react-bootstrap/Toast";
import { mutate } from "swr";
function Items({ category, brands, handleOverlay }) {
  //add filter sidebar for mobile
  //Add a way to set Upcoming items to show or not
  //parse props
  const brands_object = JSON.parse(brands);
  //get cookie
  let cookieBrand = Cookie.get("brand");
  //initialize default state
  let defaultState = [];
  if (cookieBrand === "All" || cookieBrand === undefined) {
    defaultState = brands_object.brand;
  } else {
    defaultState.push(cookieBrand);
  }
  //Brand states
  const [selected_brands, setBrands] = useState(defaultState);
  const [disabledBrand, setDisabledBrand] = useState(null);
  //Price States
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  //Temporary Fix for price changes
  const [userMinPrice, setUserMinPrice] = useState(0);
  const [userMaxPrice, setUserMaxPrice] = useState(0);
  const [sliderMinPrice, setSliderMinPrice] = useState(0);
  const [sliderMaxPrice, setSliderMaxPrice] = useState(0);
  //
  const [items, setItems] = useState(null); //change
  const [nPerPage, setnPerPage] = useState(20);
  //Temporary Fix for pagination changes
  const [pageNumber, setPageNumber] = useState(1);
  const [formPageNumber, setFormPageNumber] = useState(1);
  //Other Page Filter options
  const [sort, setSort] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  //
  const [showSideFilter, setShowFilter] = useState(false);
  //For Toast. For some reason it doesn't work with a differently named variable
  const [show, setShow] = useState(false);
  //fetch
  function getProducts() {
    fetch(
      "/api/products?" +
        new URLSearchParams({
          category: category,
          brand: selected_brands,
          pageNumber: pageNumber,
          nPerPage: nPerPage,
          sort: sort,
          userMinPrice: userMinPrice,
          userMaxPrice: userMaxPrice,
        })
    )
      .then((response) => response.json())
      .then((data) => {
        setTotal(data.totalCount);
        setMaxPrice(data.maxPrice);
        setMinPrice(data.minPrice);
        setItems(data.items);
        if (sliderMinPrice == 0 && sliderMaxPrice == 0) {
          setSliderMaxPrice(data.maxPrice);
          setSliderMinPrice(data.minPrice);
        }
        setLoading(false);
      });
  }
  //useEffect to getProducts on brands and user prices change
  useEffect(() => {
    //find disabled checkbox

    setLoading(true);
    if (selected_brands.length === 1) {
      setDisabledBrand(selected_brands[0]);
    } else {
      setDisabledBrand(null);
    }

    getProducts();
    //Filter Items on category //change
    /*  const currentFilter = items_object.filter((item) => {
      if (selected_brands.includes(item.brand)) {
        return item;
      }
    }); */
  }, [selected_brands, userMinPrice, userMaxPrice, pageNumber, sort]);
  //The states don't reset when navigating to new page. This useEffect is necessary for updating page
  useEffect(() => {
    setLoading(true);
    setItems(null); //change
    setSliderMaxPrice(0);
    setSliderMinPrice(0);
    setUserMinPrice(0);
    setUserMaxPrice(0);
    setMaxPrice(0);
    setMinPrice(0);
    setBrands(defaultState);
    window.scrollTo(0, 0);
  }, [category, cookieBrand]);
  //checkList state manager
  const handleChecklist = (selection) => {
    if (selection === "All") {
      const newArray = brands_object.brand;
      setBrands(newArray);
    } else {
      if (selected_brands.includes(selection)) {
        const newArray = selected_brands.filter((brand) => brand != selection);
        setBrands(newArray);
      } else {
        const newArray = selected_brands.map((brand) => {
          return brand;
        });
        newArray.push(selection);
        setBrands(newArray);
      }
    }
  };
  //handle filter
  const handleFilter = () => {
    setShowFilter(!showSideFilter);
    handleOverlay();
  };

  return (
    <>
      <Container fluid className={styles.mainContainer}>
        <Row style={{ margin: "0" }}>
          <Col className={styles.menuCol} lg={3} xs={12}>
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
          </Col>
          <Col className={styles.productsCol} lg={9} xs={12}>
            <Row className={styles.pageOptions}>
              <Breadcrumb className={styles.breadcrumb_custom}>
                <Breadcrumb.Item href="/">
                  <FontAwesomeIcon icon={faHome} />
                </Breadcrumb.Item>
                <Breadcrumb.Item href={`/Products/Items/${category}`}>
                  {category}
                </Breadcrumb.Item>
              </Breadcrumb>
              <div className={styles.pagination}>
                <span>Page</span>
                <div className={styles.paginationControlDiv}>
                  <FontAwesomeIcon
                    icon={faArrowCircleLeft}
                    size="lg"
                    color={pageNumber == 1 ? "lightgray" : "lightblue"}
                    className={styles.paginationButtons}
                    onClick={() => {
                      if (pageNumber - 1 > 0) {
                        setFormPageNumber(formPageNumber - 1);
                        setPageNumber(pageNumber - 1);
                      }
                    }}
                  />
                  <Form.Control
                    type="number"
                    min={1}
                    className={styles.pageInput}
                    value={formPageNumber}
                    onChange={(e) => {
                      setFormPageNumber(parseInt(e.target.value));
                    }}
                    onBlur={(e) => {
                      if (
                        parseInt(e.target.value) > 0 &&
                        parseInt(e.target.value) <= Math.ceil(total / nPerPage)
                      )
                        setPageNumber(parseInt(e.target.value));
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (
                          parseInt(e.target.value) > 0 &&
                          parseInt(e.target.value) <=
                            Math.ceil(total / nPerPage)
                        ) {
                          setPageNumber(parseInt(e.target.value));
                        }
                      }
                    }}
                    onWheel={(e) => {
                      e.target.blur();
                    }}
                    isInvalid={
                      Number(formPageNumber) < 0
                        ? true
                        : Number(formPageNumber) >
                            Math.ceil(total / nPerPage) && total > 0
                        ? true
                        : false
                    }
                  />
                  <FontAwesomeIcon
                    icon={faArrowCircleRight}
                    size="lg"
                    color={
                      pageNumber < Math.ceil(total / nPerPage)
                        ? "lightblue"
                        : "lightgray"
                    }
                    className={styles.paginationButtons}
                    onClick={() => {
                      if (pageNumber + 1 <= Math.ceil(total / nPerPage)) {
                        setFormPageNumber(formPageNumber + 1);
                        setPageNumber(pageNumber + 1);
                      }
                    }}
                  />
                </div>
                <span>of {Math.ceil(total / nPerPage)}</span>
              </div>
              <div className={styles.viewOptions}>
                <div className={styles.showDiv}>
                  <label htmlFor="show">Show: </label>
                  <select name="show" id="show">
                    <option
                      value="20"
                      onClick={() => {
                        setnPerPage(20);
                      }}
                    >
                      20
                    </option>
                    <option
                      value="24"
                      onClick={() => {
                        setnPerPage(24);
                      }}
                    >
                      24
                    </option>
                    <option
                      value="48"
                      onClick={() => {
                        setnPerPage(48);
                      }}
                    >
                      48
                    </option>
                    <option
                      value="75"
                      onClick={() => {
                        setnPerPage(75);
                      }}
                    >
                      75
                    </option>
                    <option
                      value="90"
                      onClick={() => {
                        setnPerPage(90);
                      }}
                    >
                      90
                    </option>
                  </select>
                </div>
                <div className={styles.sortDiv}>
                  <label htmlFor="sort">Sort: </label>
                  <select name="sort" id="sort">
                    <option
                      value="1"
                      onClick={() => {
                        setSort(1);
                      }}
                    >
                      Price (Low {`>`} High)
                    </option>
                    <option
                      value="-1"
                      onClick={() => {
                        setSort(-1);
                      }}
                    >
                      Price (High {`>`} Low)
                    </option>
                  </select>
                </div>
              </div>
              <div
                className={styles.mobileFilter}
                onClick={() => {
                  handleFilter();
                }}
              >
                <FontAwesomeIcon icon={faBars} color="white" /> Filter
              </div>
            </Row>
            <Row className={styles.items}>
              {loading == true ? (
                <div className={styles.loader}>
                  <Spinner animation="border" />
                </div>
              ) : (
                items.map((item, i) => {
                  return (
                    <Col
                      lg={3}
                      xs={12}
                      sm={4}
                      className={styles.itemCol}
                      key={i}
                    >
                      <Card className={styles.card}>
                        <Link
                          href={`/Products/Item/${item.category}/${item.name}`}
                          passHref={true}
                        >
                          <a className={styles.cardLink}>
                            <Card.Img
                              variant="top"
                              src={item.imageLink}
                              className={styles.cardImage}
                            />
                          </a>
                        </Link>
                        <Card.Body className={styles.cardBody}>
                          <Card.Title className={styles.cardTitle}>
                            {item.name}
                          </Card.Title>
                          <div className={styles.descriptionList}>
                            <ul>
                              {item.description.map((desc, i) => {
                                return <li key={i}>{desc}</li>;
                              })}
                            </ul>
                          </div>

                          <Card.Text className={styles.cardFooter}>
                            <span className={styles.cardFooter_price}>
                              {item.price > 0 ? item.price + "৳" : "Upcoming"}
                            </span>
                            <div className={styles.cardFooter_buttons}>
                              <Button
                                variant="outline-success"
                                block
                                onClick={async () => {
                                  const resp = await cartAction({
                                    action: "addOne",
                                    id: item._id,
                                    image: item.imageLink,
                                    name: item.name,
                                    price: item.price,
                                  });
                                  if (resp === "success") {
                                    mutate("/api/cartApi");
                                    setShow(true);
                                  }
                                }}
                              >
                                Add to Cart!
                              </Button>
                              <Link
                                href={`/Products/Item/${item.category}/${item.name}`}
                                passHref={true}
                              >
                                <Button
                                  href="#"
                                  variant="outline-primary"
                                  block
                                >
                                  View
                                </Button>
                              </Link>
                            </div>
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })
              )}
            </Row>
            <Row
              className={styles.pageOptions_footer}
              style={{ display: loading === true ? "none" : "flex" }}
            >
              <div className={styles.pagination_footer}>
                <span>Page</span>
                <div className={styles.paginationControlDiv}>
                  <FontAwesomeIcon
                    icon={faArrowCircleLeft}
                    size="lg"
                    color={pageNumber == 1 ? "lightgray" : "lightblue"}
                    className={styles.paginationButtons}
                    onClick={() => {
                      if (pageNumber - 1 > 0) {
                        window.scrollTo(0, 0);
                        setFormPageNumber(formPageNumber - 1);
                        setPageNumber(pageNumber - 1);
                      }
                    }}
                  />
                  <Form.Control
                    type="number"
                    min={1}
                    className={styles.pageInput}
                    value={formPageNumber}
                    onChange={(e) => {
                      setFormPageNumber(parseInt(e.target.value));
                    }}
                    onBlur={(e) => {
                      if (
                        parseInt(e.target.value) > 0 &&
                        parseInt(e.target.value) <= Math.ceil(total / nPerPage)
                      ) {
                        window.scrollTo(0, 0);
                        setPageNumber(parseInt(e.target.value));
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (
                          parseInt(e.target.value) > 0 &&
                          parseInt(e.target.value) <=
                            Math.ceil(total / nPerPage)
                        ) {
                          window.scrollTo(0, 0);
                          setPageNumber(parseInt(e.target.value));
                        }
                      }
                    }}
                    onWheel={(e) => {
                      e.target.blur();
                    }}
                    isInvalid={
                      Number(formPageNumber) < 0
                        ? true
                        : Number(formPageNumber) >
                            Math.ceil(total / nPerPage) && total > 0
                        ? true
                        : false
                    }
                  />
                  <FontAwesomeIcon
                    icon={faArrowCircleRight}
                    size="lg"
                    color={
                      pageNumber < Math.ceil(total / nPerPage)
                        ? "lightblue"
                        : "lightgray"
                    }
                    className={styles.paginationButtons}
                    onClick={() => {
                      if (pageNumber + 1 <= Math.ceil(total / nPerPage)) {
                        window.scrollTo(0, 0);
                        setFormPageNumber(formPageNumber + 1);
                        setPageNumber(pageNumber + 1);
                      }
                    }}
                  />
                </div>
                <span>of {Math.ceil(total / nPerPage)}</span>
              </div>
            </Row>
            <div
              style={{
                position: "fixed",
                bottom: 0,
                left: "60%",
                transform: "translate(-60%)",
              }}
            >
              <Toast
                onClose={() => setShow(false)}
                show={show}
                delay={3000}
                autohide
              >
                <Toast.Body
                  style={{
                    background: "green",
                    color: "white",
                    border: "1px solid black",
                    borderRadius: "5%",
                    opacity: "0.7",
                  }}
                >
                  Added To Cart!
                </Toast.Body>
              </Toast>
            </div>
          </Col>
        </Row>
        <SideFilter
          handleFilter={handleFilter}
          showSideFilter={showSideFilter}
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
  var brands = JSON.stringify(Brands[0]);
  return {
    props: { category: params.category, brands },
    revalidate: 600,
  };
}