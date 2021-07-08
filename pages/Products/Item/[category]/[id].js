import React, { useState, useEffect } from "react";
import { connectToDatabase } from "../../../../utils/mongodb";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { Container, Row, Col } from "react-bootstrap";
import styles from "../../../../styles/products/SingleProduct.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faEdit } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { motion } from "framer-motion";
import Link from "next/link";
import Cookie from "js-cookie";
import { cartAction } from "../../../../functions/functions";
import { mutate } from "swr";
function Products({
  item,
  RelatedItems,
  fireSwal,
  categories_data,
  setCategories,
}) {
  //Sets the subNav instantly with no load time
  useEffect(() => {
    if (categories_data) {
      setCategories(categories_data);
    }
  }, [categories_data]);

  const [purchaseAmount, setPurchaseAmount] = useState(1);
  // For reviews and specification animations
  const [direction, setDirection] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  let mainDescription = undefined;
  let specifications = undefined;
  if (item != undefined) {
    specifications = item.specifications;
    mainDescription = item.mainDescription;
  }
  //for Add To Cart Button
  const [addingToCart, setAddToCart] = useState(false);
  let specificationRows = [];
  let mainDescriptionRows = [];
  const switchDiv = (index) => {
    setDirection(index - activeIndex);
    setActiveIndex(index);
  };

  const divAnimation = {
    active: (direction) => ({
      opacity: 1,
      x: [direction === 0 ? 0 : direction > 0 ? 100 : -100, 0],
      display: "block",
      transition: {
        type: "tween",
        delay: 0.3,
        duration: 0.3,
      },
    }),
    inactive: (direction) => ({
      opacity: 0,
      x: direction > 0 ? -100 : 100,
      transition: {
        type: "tween",
        duration: 0.3,
      },
      transitionEnd: {
        display: "none",
      },
    }),
  };
  if (mainDescription === undefined) {
    for (var key1 in specifications) {
      let specification = specifications[key1];
      specificationRows.push(
        <Row className={styles.key1} key={key1}>
          <Col>
            <h5>{key1}</h5>
          </Col>
        </Row>
      );
      let columns = [];

      for (var key2 in specification) {
        columns.push(
          <Row className={styles.subFeatureRow} key={key2}>
            <Col lg={4}>
              <p className={styles.key2}>{key2}</p>
            </Col>
            <Col lg={8}>
              <ul className={styles.key2List}>
                {specification[key2].map((item, i) => {
                  return <li key={i}>{item}</li>;
                })}
              </ul>
            </Col>
            <hr className={styles.divider} />
          </Row>
        );
      }
      specificationRows.push(columns);
    }
  } else if (specifications === undefined) {
    const filter = mainDescription.description.filter(
      (desc) => desc != item.name && desc.length > 0
    );
    mainDescriptionRows = filter.map((desc, i) => {
      return <li key={i}>{desc}</li>;
    });
  }
  return (
    <>
      <Container style={{ marginTop: "1rem" }}>
        <Breadcrumb className={styles.breadcrumb_custom}>
          <Breadcrumb.Item href="/">
            <FontAwesomeIcon icon={faHome} color="black" />
          </Breadcrumb.Item>
          <Breadcrumb.Item
            href={`/Products/Items/${encodeURIComponent(item.category)}`}
            onClick={() => {
              Cookie.set("brand", "All", { sameSite: "strict" });
            }}
          >
            {decodeURIComponent(item.category)}
          </Breadcrumb.Item>
          <Breadcrumb.Item
            href={`/Products/Items/${encodeURIComponent(item.category)}`}
            onClick={() => {
              Cookie.set("brand", item.brand, { sameSite: "strict" });
            }}
          >
            {item.brand}
          </Breadcrumb.Item>
          <Breadcrumb.Item active>{item.name}</Breadcrumb.Item>
        </Breadcrumb>
        <Row>
          <Col lg={5} xs={12} sm={12} md={4} className={styles.imageContainer}>
            <Image
              src={item.imageLink}
              layout="fill"
              className={styles.image}
              alt={item.name}
            />
          </Col>
          <Col lg={7} xs={12} sm={12} md={8}>
            <Row>
              <h4 className={styles.itemName}>{item.name}</h4>
            </Row>
            <Row className={styles.infoBar}>
              {item.price > 0 ? (
                <div>
                  Price : <strong>&#36;{item.price}</strong>
                </div>
              ) : (
                <div>
                  Price : <strong>Upcoming!</strong>
                </div>
              )}
              <div>
                Status : <strong>In Stock</strong>
              </div>
              <div>
                Product Code : <strong>{item.productCode}</strong>
              </div>
              <div>
                Brand : <strong>{item.brand}</strong>
              </div>
            </Row>
            <Row className={styles.keyFeatures}>
              <h5>Key Features</h5>
              <ul>
                {item.description.map((point, i) => {
                  return <li key={i}>{point}</li>;
                })}
              </ul>
              <a href="#purchase_row" className={styles.moreInfoLink}>
                View More Info
              </a>
            </Row>
            <Row className={styles.purchaseRow} id="purchase_row">
              {item.price > 0 ? (
                <>
                  <h5 className={styles.purchaseHeader}>Payment</h5>
                  <div className={styles.purchaseButton}>
                    <Form.Control
                      type="number"
                      min={1}
                      className={styles.quantityInput}
                      onChange={(e) => {
                        setPurchaseAmount(parseInt(e.target.value));
                      }}
                      onWheel={(e) => {
                        e.target.blur();
                      }}
                      value={purchaseAmount}
                      isValid={Number(purchaseAmount) > 0 ? true : false}
                      isInvalid={Number(purchaseAmount) < 0 ? true : false}
                    />
                    <Button
                      variant={addingToCart ? "outline-info" : "primary"}
                      className={styles.purchase_button}
                      disabled={
                        addingToCart
                          ? true
                          : Number(purchaseAmount) <= 0
                          ? true
                          : false
                      }
                      id="purchase_button"
                      onClick={async () => {
                        setAddToCart(true);
                        const resp = await cartAction({
                          action: "addOne",
                          id: item._id,
                          image: item.imageLink,
                          name: item.name,
                          price: item.price,
                        });
                        if (resp === "success") {
                          mutate("/api/cartApi");
                          fireSwal();
                          setAddToCart(false);
                        }
                      }}
                    >
                      {addingToCart ? "Adding..." : "Buy"}
                    </Button>
                  </div>
                </>
              ) : (
                <div className={styles.upComing}>Upcoming!</div>
              )}
            </Row>
          </Col>
        </Row>
        {/*  <div id="productDetailNav" style={{ height: "55px" }}></div> */}
        <Row className={styles.productDetailNav}>
          <Col>
            <ul>
              <li>
                <a
                  onClick={() => {
                    switchDiv(0);
                  }}
                  className={activeIndex == 0 ? styles.active : ""}
                >
                  Specification
                </a>
              </li>
              <li>
                <a
                  onClick={() => {
                    switchDiv(1);
                  }}
                  className={activeIndex == 1 ? styles.active : ""}
                >
                  Reviews
                </a>
              </li>
            </ul>
          </Col>
        </Row>
        <Row className={styles.spec_suggest_row}>
          <Col lg={9} sm={12} xs={12} className={styles.spec_review_col}>
            <motion.div
              variants={divAnimation}
              initial="inactive"
              custom={direction}
              animate={activeIndex == 0 ? "active" : "inactive"}
              className={styles.specificationsCol}
            >
              <h4 className={styles.specificationsHeader}>
                {specifications != undefined ? "Specification" : "Description"}
              </h4>
              {specifications != undefined ? (
                specificationRows
              ) : (
                <ul className={styles.mainDescriptionList}>
                  {mainDescriptionRows}
                </ul>
              )}
            </motion.div>
            <motion.div
              variants={divAnimation}
              initial="inactive"
              custom={direction}
              animate={activeIndex == 1 ? "active" : "inactive"}
              className={styles.reviewsDiv}
            >
              <div className={styles.reviewsHeader}>
                <div>
                  <h5>Reviews (0)</h5>
                  <h6>Check out What the Others Are Saying!</h6>
                </div>
                <div>
                  <Button
                    variant="outline-primary"
                    className={styles.review_button}
                    disabled
                  >
                    Write A Review
                  </Button>
                </div>
              </div>
              <hr className={styles.divider} />
              <div className={styles.noReviews}>
                <div>
                  <FontAwesomeIcon icon={faEdit} size="4x" />
                </div>
                <h6>No reviews yet? Be the first!</h6>
              </div>
              {/* <div className={styles.reviewsList}>
                <div className={styles.reviewContainer}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.userContainer}>
                      <div className={styles.userImageContainer}>
                        <img
                          src={`/image samples/sample_user/default.png`}
                          className={styles.userImage}
                        />
                      </div>
                      <div className={styles.userName}>Abdullah Al Zarif</div>
                    </div>

                    <div className={styles.reviewDate}>
                      <p>25/06/2021</p>
                    </div>
                  </div>
                  <hr className={styles.divider} />
                  <div className={styles.reviewBody}>
                    Tempor dolore cupidatat id occaecat sunt nostrud. Est nisi
                    elit occaecat laboris elit excepteur eu ut sit. Sint non ea
                  </div>
                </div>
              </div> */}
            </motion.div>
          </Col>
          <Col lg={3} sm={12} xs={12} className={styles.suggestionsCol}>
            <div className={styles.suggestionsDiv}>
              <h4 className={styles.relatedProductsHeader}>Related Products</h4>
              {RelatedItems.map((relatedItem, i) => {
                return (
                  <Link
                    href={`/Products/Item/${encodeURIComponent(
                      item.category
                    )}/${encodeURIComponent(relatedItem.productCode)}`}
                    passHref={true}
                    key={i}
                  >
                    <a className={styles.suggestionLinks}>
                      <div className={styles.suggestionCard}>
                        <div>
                          <img
                            src={relatedItem.imageLink}
                            className={styles.suggestionImage}
                          />
                        </div>
                        <div className={styles.suggestionInfo}>
                          <div>{relatedItem.name}</div>
                          {item.price > 0 ? (
                            <div>&#36;{relatedItem.price}</div>
                          ) : (
                            <div>Upcoming!</div>
                          )}
                        </div>
                      </div>
                    </a>
                  </Link>
                );
              })}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Products;

export async function getStaticPaths() {
  const { db } = await connectToDatabase();
  const data = await db
    .collection("Items")
    .find()
    .project({ _id: 0, productCode: 1, category: 1 })
    .toArray();
  if (!data) {
    return {
      notFound: true,
    };
  }
  const paths = data.map((items) => {
    return {
      params: {
        id: items.productCode,
        category: items.category,
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
  const categories_data = await db
    .collection("Categories")
    .find()
    .project({ _id: 0, category: 1, brand: 1 })
    .toArray();
  const Item = await db
    .collection("Items")
    .find({ category: params.category, productCode: params.id })
    .toArray();

  let RelatedItems;
  let item;
  if (Item[0] != undefined) {
    if (Item[0].mainDescription === undefined) {
      item = {
        _id: JSON.parse(JSON.stringify(Item[0]._id)),
        productCode: Item[0].productCode,
        specifications: Item[0].specifications,
        brand: Item[0].brand,
        category: Item[0].category,
        name: Item[0].name,
        description: Item[0].description,
        price: Item[0].price,
        imageLink: Item[0].imageLink,
        reviews: Item[0].reviews,
      };
    } else {
      item = {
        _id: JSON.parse(JSON.stringify(Item[0]._id)),
        productCode: Item[0].productCode,
        brand: Item[0].brand,
        category: Item[0].category,
        name: Item[0].name,
        description: Item[0].description,
        price: Item[0].price,
        imageLink: Item[0].imageLink,
        reviews: Item[0].reviews,
        mainDescription: Item[0].mainDescription,
      };
    }
    if (Item[0].price === 0) {
      RelatedItems = await db
        .collection("Items")
        .find({
          category: params.category,
          productCode: { $nin: [Item[0].productCode] },
        })
        .project({ _id: 0, name: 1, imageLink: 1, price: 1, productCode: 1 })
        .sort({ price: -1 })
        .limit(5)
        .toArray();
    } else {
      RelatedItems = await db
        .collection("Items")
        .find({
          category: params.category,
          price: { $lte: Item[0].price, $gt: 0 },
          productCode: { $nin: [Item[0].productCode] },
        })
        .sort({ price: -1 })
        .project({ _id: 0, name: 1, imageLink: 1, price: 1, productCode: 1 })
        .limit(5)
        .toArray();
      if (RelatedItems.length < 5) {
        RelatedItems = await db
          .collection("Items")
          .find({
            category: params.category,
            price: { $gte: Item[0].price },
            productCode: { $nin: [Item[0].productCode] },
          })
          .sort({ price: 1 })
          .project({
            _id: 0,
            name: 1,
            imageLink: 1,
            price: 1,
            productCode: 1,
          })
          .limit(5)
          .toArray();
      }
    }
  }

  return {
    props: { item, RelatedItems, categories_data },
    revalidate: 600,
  };
}
