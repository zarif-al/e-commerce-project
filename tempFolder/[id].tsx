import React, { useState } from "react";
import NavBar from "../components/nav/Nav";
import { connectToDatabase } from "../utils/mongodb";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Link from "next/link";
import Button from "react-bootstrap/Button";
import { mutate } from "swr";

import { cartAction } from "../functions/functions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowAltCircleLeft,
  faCartPlus,
} from "@fortawesome/free-solid-svg-icons";
import Toast from "react-bootstrap/Toast";
import Head from "next/head";
function Items({ Item }) {
  let { id, name, price, description, imageLink, type } = Item;
  const [show, setShow] = useState(false);
  let listKeys = 0;
  return (
    <>
      <Head>
        <title>{name}</title>
      </Head>
      <Container fluid style={{ padding: "0" }}>
        <NavBar screen="home" />
        <Container style={{ marginBottom: "3.5rem" }}>
          <Row className="align-items-center">
            <Col>
              <Image src={imageLink} rounded />
            </Col>
            <Col>
              <Row className="text-center">
                <h1>{name}</h1>
              </Row>
              <Row style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                <strong>Product Type : </strong> {type}
              </Row>
              <Row style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                <Container>
                  <Row>
                    <strong>Product Description </strong>
                  </Row>
                  <Row>
                    <ul>
                      {description.map((description) => {
                        return <li key={listKeys++}>{description}</li>;
                      })}
                    </ul>
                  </Row>
                </Container>
              </Row>
              <Row style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                <strong>Price : </strong>
                Tk {price}
              </Row>
              <Row style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                <Button
                  variant="success"
                  onClick={async () => {
                    const resp = await cartAction({
                      action: "addOne",
                      id: id,
                      image: imageLink,
                      name: name,
                      price: price,
                    });
                    if (resp === "success") {
                      setShow(true);
                      mutate("/api/userApi");
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faCartPlus} color="white" /> Add to
                  Cart
                </Button>
              </Row>
            </Col>
          </Row>
          <div
            style={{
              position: "fixed",
              bottom: 0,
              left: "50%",
              transform: "translate(-50%)",
            }}
          >
            <Toast
              onClose={() => setShow(false)}
              show={show}
              delay={2000}
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
        </Container>
        <Container
          fluid
          style={{
            position: "absolute",
            bottom: "0",
            backgroundColor: "black",
          }}
        >
          <Row style={{ paddingTop: "1rem", paddingBottom: "1rem" }}>
            <Col className="text-start" style={{ color: "white" }}>
              © Copyright 2021 Ecommerce Demo. All rights reserved.
            </Col>
            <Col className="text-right" style={{ color: "white" }}>
              <a href="/privacyPolicy" target="_blank">
                Privacy Policy
              </a>
            </Col>
          </Row>
        </Container>
      </Container>
    </>
  );
}

export default Items;

export async function getStaticPaths() {
  const { db } = await connectToDatabase();
  const data = await db
    .collection("Items")
    .find()
    .project({ _id: 0, name: 1 })
    .toArray();
  if (!data) {
    return {
      notFound: true,
    };
  }
  const paths = data.map((items) => {
    return {
      params: {
        id: items.name,
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
  const data = await db.collection("Items").find({ name: params.id }).toArray();
  if (!data) {
    return {
      notFound: true,
    };
  }

  const Items = data.map((items, index) => {
    return {
      id: items._id.toString(),
      name: items.name,
      description: items.description,
      price: items.price,
      imageLink: items.imageLink,
      type: items.productType,
    };
  });
  const Item = Items[0];
  return {
    props: { Item },
    revalidate: 600,
  };
}
