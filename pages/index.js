import { connectToDatabase } from "../utils/mongodb";
import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Carousel from "react-bootstrap/Carousel";
import styles from "../styles/index/Index.module.css";
import Featured from "../components/index/Featured";
import { useEffect } from "react";
export default function Home({ Items, categories_data, setCategories }) {
  //Sets the subNav instantly with no load time
  useEffect(() => {
    if (categories_data) {
      setCategories(categories_data);
    }
  }, [categories_data]);

  return (
    <Container className={styles.indexContainer}>
      <Carousel indicators={false}>
        <Carousel.Item interval={1500}>
          <img
            className={styles.carouselImage}
            src="image samples/banners/asus.jpg"
            alt="First slide"
          />
        </Carousel.Item>
        <Carousel.Item interval={1500}>
          <img
            className={styles.carouselImage}
            src="/image samples/banners/intel.jpg"
            alt="Second slide"
          />
        </Carousel.Item>
        <Carousel.Item interval={1500}>
          <img
            className={styles.carouselImage}
            src="/image samples/banners/logitech.jpg"
            alt="Third slide"
          />
        </Carousel.Item>
      </Carousel>

      <Row className={styles.featureRow}>
        <h4 className={styles.featuredHeader}>Featured Products</h4>
        <h6 className={styles.featuredSubHeader}>
          Our Best Selection. Take Your Pick!
        </h6>
      </Row>
      <Featured Items={Items} />
    </Container>
  );
}

export async function getStaticProps(context) {
  const { db } = await connectToDatabase();

  const categories_data = await db
    .collection("Categories")
    .find()
    .project({ _id: 0, category: 1, brand: 1 })
    .toArray();

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
    .find({ category: "Graphics_Card" })
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
      categories_data,
    },
    revalidate: 600,
  };
}
