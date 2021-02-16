import React from "react";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import styles from "../styles/Product.module.css";
import Row from "react-bootstrap/Row";
import Link from "next/link";
import { cartAction } from "../functions/functions";
import { mutate } from "swr";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faCartPlus } from "@fortawesome/free-solid-svg-icons";
import Image from "react-bootstrap/Image";
function ProductColumns({
  lowerLimit,
  showLimit,
  items,
  sortOption,
  itemOption,
  setLength,
  searchValue,
  setShow,
}) {
  let filterArray = [];
  if (itemOption === "All") {
    filterArray = items.filter((item) => {
      return item;
    });
    setLength(filterArray.length);
  } else {
    filterArray = items.filter((item) => {
      return item.type === itemOption;
    });
    setLength(filterArray.length);
  }

  if (sortOption === "Price:Ascending") {
    filterArray.sort(function (a, b) {
      return a.price - b.price;
    });
  }
  if (sortOption === "Price:Descending") {
    filterArray.sort(function (a, b) {
      return b.price - a.price;
    });
  }
  if (sortOption === "Default") {
    filterArray.sort(function (a, b) {
      return a.order - b.order;
    });
  }
  if (searchValue != "") {
    var regexp = new RegExp(searchValue.replace(/\s*$/, ""), "i");
    filterArray = filterArray.filter((item) => item.name.match(regexp));
    setLength(filterArray.length);
  }
  let column = [];

  if (filterArray.length === 0) {
    column.push(
      <Col className="text-center" style={{ marginTop: "2rem" }}>
        <h3>Sorry! No Items Match Your Search Term</h3>
        <Image
          src="/sadPanda.png"
          rounded
          style={{ height: "50vh", marginTop: "1rem" }}
        />
      </Col>
    );
  }

  let listKeys = 0;
  let itemIndex = lowerLimit;
  for (
    var i = 0;
    i <
    (lowerLimit + showLimit < filterArray.length
      ? showLimit
      : filterArray.length - lowerLimit);
    i++
  ) {
    let productId = filterArray[itemIndex].id;
    let productCode = filterArray[itemIndex].productCode;
    let productName = filterArray[itemIndex].name;
    let productImage = filterArray[itemIndex].imageLink;
    let productPrice = filterArray[itemIndex].price;
    let productDescription = filterArray[itemIndex].description;
    column.push(
      <Col className={styles.columns} key={productCode}>
        <Card style={{ width: "18rem" }}>
          <Card.Img variant="top" src={productImage} />
          <Card.Body>
            <Card.Title>{productName}</Card.Title>
            <ul>
              {productDescription.map((description) => {
                return <li key={listKeys++}>{description}</li>;
              })}
            </ul>
            <Row style={{ marginLeft: "1.4rem" }}>
              <strong>Price : Tk {productPrice}</strong>
            </Row>
          </Card.Body>
          <Card.Footer>
            <Row className="justify-content-around">
              {/*  <Link href={`/${productName}`} passHref> */}
              <Button
                variant="primary"
                onClick={() => {
                  window.open(`/${productName}`, "_blank");
                }}
              >
                <FontAwesomeIcon icon={faEye} color="white" /> View
              </Button>
              {/* </Link> */}
              <Button
                variant="success"
                onClick={async () => {
                  const resp = await cartAction({
                    action: "addOne",
                    id: productId,
                    image: productImage,
                    name: productName,
                    price: productPrice,
                  });
                  if (resp === "success") {
                    mutate("/api/userApi");
                    setShow(true);
                  }
                }}
              >
                <FontAwesomeIcon icon={faCartPlus} color="white" /> Add to Cart
              </Button>
            </Row>
          </Card.Footer>
        </Card>
      </Col>
    );
    itemIndex++;
  }
  return <>{column}</>;
}

export default ProductColumns;
