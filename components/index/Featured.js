import React from "react";
import { Row, Col } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import styles from "../../styles/index/components/Feature.module.css";
import Link from "next/link";

function Featured({ Items }) {
  let itemsRow = [];
  let row = [];
  Items.forEach((item, i) => {
    row.push(
      <Col
        xs={6}
        sm={6}
        md={3}
        key={item.productCode}
        className={styles.column + " d-flex justify-content-center"}
      >
        <Link
          href={`/Products/Item/${encodeURIComponent(
            item.category
          )}/${encodeURIComponent(item.productCode)}`}
          passHref={true}
        >
          <a>
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
                <Card.Text className={styles.cardText}>{item.price}৳</Card.Text>
              </Card.Body>
            </Card>
          </a>
        </Link>
      </Col>
    );
    if ((i + 1) % 4 === 0) {
      itemsRow.push(
        <Row className={styles.row} key={i}>
          {row}
        </Row>
      );
      row = [];
    }
  });
  return <>{itemsRow}</>;
}

export default Featured;
