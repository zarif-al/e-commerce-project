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
  relatedItems,
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
  //Fix for Json Parse error given in vercel logs
  console.log(item);
  console.log(relatedItems);
  if (item === undefined || relatedItems === undefined) {
    return <></>;
  }
  const item_object = JSON.parse(item);
  const relatedItems_array = JSON.parse(relatedItems);
  //
  const [purchaseAmount, setPurchaseAmount] = useState(1);
  // For reviews and specification animations
  const [direction, setDirection] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const specifications = item_object.specifications;
  const mainDescription = item_object.mainDescription;
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
      (desc) => desc != item_object.name && desc.length > 0
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
            href={`/Products/Items/${encodeURIComponent(item_object.category)}`}
            onClick={() => {
              Cookie.set("brand", "All", { sameSite: "strict" });
            }}
          >
            {decodeURIComponent(item_object.category)}
          </Breadcrumb.Item>
          <Breadcrumb.Item
            href={`/Products/Items/${encodeURIComponent(item_object.category)}`}
            onClick={() => {
              Cookie.set("brand", item_object.brand, { sameSite: "strict" });
            }}
          >
            {item_object.brand}
          </Breadcrumb.Item>
          <Breadcrumb.Item active>{item_object.name}</Breadcrumb.Item>
        </Breadcrumb>
        <Row>
          <Col lg={5} xs={12} sm={12} md={4} className={styles.imageContainer}>
            <Image
              src={item_object.imageLink}
              layout="fill"
              className={styles.image}
              alt={item_object.name}
            />
          </Col>
          <Col lg={7} xs={12} sm={12} md={8}>
            <Row>
              <h4 className={styles.itemName}>{item_object.name}</h4>
            </Row>
            <Row className={styles.infoBar}>
              {item_object.price > 0 ? (
                <div>
                  Price : <strong>&#36;{item_object.price}</strong>
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
                Product Code : <strong>{item_object.productCode}</strong>
              </div>
              <div>
                Brand : <strong>{item_object.brand}</strong>
              </div>
            </Row>
            <Row className={styles.keyFeatures}>
              <h5>Key Features</h5>
              <ul>
                {item_object.description.map((point, i) => {
                  return <li key={i}>{point}</li>;
                })}
              </ul>
              <a href="#purchase_row" className={styles.moreInfoLink}>
                View More Info
              </a>
            </Row>
            <Row className={styles.purchaseRow} id="purchase_row">
              {item_object.price > 0 ? (
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
                          id: item_object._id,
                          image: item_object.imageLink,
                          name: item_object.name,
                          price: item_object.price,
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
              {relatedItems_array.map((item, i) => {
                return (
                  <Link
                    href={`/Products/Item/${encodeURIComponent(
                      item_object.category
                    )}/${encodeURIComponent(item.productCode)}`}
                    passHref={true}
                    key={i}
                  >
                    <a className={styles.suggestionLinks}>
                      <div className={styles.suggestionCard}>
                        <div>
                          <img
                            src={item.imageLink}
                            className={styles.suggestionImage}
                          />
                        </div>
                        <div className={styles.suggestionInfo}>
                          <div>{item.name}</div>
                          {item.price > 0 ? (
                            <div>&#36;{item.price}</div>
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
  if (Item[0] != undefined) {
    if (Item[0].price === 0) {
      RelatedItems = await db
        .collection("Items")
        .find({
          category: params.category,
          productCode: { $nin: [Item[0].productCode] },
        })
        .project({ _id: -1, name: 1, imageLink: 1, price: 1, productCode: 1 })
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
        .project({ _id: -1, name: 1, imageLink: 1, price: 1, productCode: 1 })
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
          .project({
            _id: -1,
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

  if (!Item) {
    return {
      notFound: true,
    };
  }
  var item = JSON.stringify(Item[0]);
  var relatedItems = JSON.stringify(RelatedItems);
  return {
    props: { item, relatedItems, categories_data },
    revalidate: 600,
  };
}
