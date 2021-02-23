import Head from "next/head";
import Container from "react-bootstrap/Container";
import NavBar from "../components/Nav";
import Product from "../components/Product";
import { connectToDatabase } from "../utils/mongodb";
import React, { useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Toast from "react-bootstrap/Toast";
export default function Home({ Items, types }) {
  const [loginShow, setLoginShow] = useState(false);
  const [show, setShow] = useState(false);
  return (
    <>
      <Head>
        <title>E-Commerce App</title>
      </Head>
      <Container fluid id="PageTop" style={{ padding: "0" }}>
        <NavBar screen="home" />
        <Container style={{ marginBottom: "3.5rem" }}>
          <Row>
            <Product items={Items} setShow={setShow} types={types} />
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

export async function getStaticProps(context) {
  const { db } = await connectToDatabase();
  const data = await db.collection("Items").find().toArray();
  if (!data) {
    return {
      notFound: true,
    };
  }

  const types = [];

  const Items = data.map((items, index) => {
    if (types.find((type) => type === items.productType) === undefined) {
      types.push(items.productType);
    }
    return {
      order: index,
      id: items._id.toString(),
      productCode: items.productCode,
      name: items.name,
      description: items.description,
      price: items.price,
      pageLink: items.pageLink,
      imageLink: items.imageLink,
      type: items.productType,
    };
  });
  return {
    props: { Items, types },
    revalidate: 600,
  };
}
