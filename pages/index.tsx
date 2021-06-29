import { connectToDatabase } from "../utils/mongodb";
import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Carousel from "react-bootstrap/Carousel";
import styles from "../styles/Home.module.css";
import Featured from "../components/Featured";
export default function Home({ Items }) {
  return (
    <div style={{ height: "fit-content" }}>
      <Container
        style={{ marginTop: "1rem" }}
        className="justify-content-center"
      >
        <Carousel fade indicators={false}>
          <Carousel.Item interval={2000}>
            <img
              className={styles.carouselImage}
              src="image samples/banners/asus.jpg"
              alt="First slide"
            />
          </Carousel.Item>
          <Carousel.Item interval={2000}>
            <img
              className={styles.carouselImage}
              src="image samples/banners/intel.jpg"
              alt="Second slide"
            />
          </Carousel.Item>
          <Carousel.Item interval={2000}>
            <img
              className={styles.carouselImage}
              src="image samples/banners/logitech.jpg"
              alt="Third slide"
            />
          </Carousel.Item>
        </Carousel>

        <Row className="align-items-center mt-3 flex-column">
          <h4 className={styles.featuredHeader}>Featured Products</h4>
          <h6 className={styles.featuredSubHeader}>
            Our Best Selection. Take Your Pick!
          </h6>
        </Row>
        <Featured Items={Items} />
      </Container>
    </div>
  );
}

export async function getStaticProps(context) {
  const { db } = await connectToDatabase();

  const keyboards_data = await db
    .collection("Items")
    .find({ category: "Keyboard" })
    .project({
      _id: 0,
      productCode: 1,
      name: 1,
      price: 1,
      imageLink: 1,
      category: 1,
    })
    .sort({ price: -1 })
    .limit(4)
    .toArray();

  const graphics_data = await db
    .collection("Items")
    .find({ category: "Graphics Card" })
    .project({
      _id: 0,
      productCode: 1,
      name: 1,
      price: 1,
      imageLink: 1,
      category: 1,
    })
    .sort({ price: -1 })
    .limit(4)
    .toArray();

  const headphones_data = await db
    .collection("Items")
    .find({ category: "Headphone" })
    .project({
      _id: 0,
      productCode: 1,
      name: 1,
      price: 1,
      imageLink: 1,
      category: 1,
    })
    .sort({ price: -1 })
    .limit(4)
    .toArray();

  const items_data = keyboards_data.concat(graphics_data, headphones_data);
  return {
    props: {
      Items: items_data,
    },
    revalidate: 600,
  };
}
