import React, { useState } from "react";
import useSWR from "swr";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Link from "next/link";
import NavBar from "../components/Nav";
import LoginModal from "../components/LoginModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import OrderDetailsModal from "../components/OrderDetailsModal";
function orders() {
  const fetcher = (url) => fetch(url).then((r) => r.json());
  const { data } = useSWR("/api/orderApi", fetcher);
  const [loginModalShow, setLoginModalShow] = useState(false);
  const [orderModalShow, setOrderModalShow] = useState(false);
  const [orderData, setOrderData] = useState(null);
  let rows = [];

  const setupModal = (index) => {
    setOrderData(data.order[index]);
    setOrderModalShow(true);
  };

  if (data != undefined) {
    if (data.message != "error") {
      if (data.order.length != 0) {
        rows.push(
          <Row className="border border-primary text-center">
            <Col className="border border-primary">
              <strong>Order ID</strong>
            </Col>
            <Col className="border border-primary">
              <strong>Order Date</strong>
            </Col>
            <Col className="border border-primary">
              <strong>Delivered Address</strong>
            </Col>
            <Col className="border border-primary">
              <strong>Amount</strong>
            </Col>
            <Col className="border border-primary">
              <strong>View Order</strong>
            </Col>
            <Col className="border border-primary">
              <strong>Payment Status</strong>
            </Col>
          </Row>
        );

        for (var i = 0; i < data.order.length; i++) {
          let sum = 0;
          //console.log(data.order[0].orders[i].items);
          data.order[i].items.forEach((item) => {
            sum += item.quantity * item.price;
          });
          let index = i;
          const { orderId, createdAt, address } = data.order[i];
          rows.push(
            <Row className="border border-primary text-center align-items-center">
              <Col>{orderId}</Col>
              <Col>{createdAt.toString().slice(0, 9)}</Col>
              <Col>{address}</Col>
              <Col>Tk {sum}</Col>
              <Col>
                <Button
                  variant="link"
                  onClick={() => {
                    setupModal(index);
                  }}
                >
                  <FontAwesomeIcon icon={faEye} color="blue" /> View
                </Button>
              </Col>
              <Col>{data.order[i].payStatus}</Col>
            </Row>
          );
        }
      }
    }
  }
  return (
    <Container fluid style={{ padding: "0" }}>
      <NavBar screen="home" />
      {data != undefined ? (
        data.message != "error" ? (
          data.order.length != 0 ? (
            <>
              <Container>
                <Row
                  className="justify-content-center"
                  style={{ marginTop: "2rem", marginBottom: "1rem" }}
                >
                  <h3>Your Orders</h3>
                </Row>
                {rows}
              </Container>
            </>
          ) : (
            <>
              <Container>
                <Row
                  className="justify-content-center"
                  style={{ marginTop: "2rem", marginBottom: "1rem" }}
                >
                  <h1>Orders</h1>
                </Row>
                <div className="border border-primary">
                  <Row className="justify-content-center">
                    <h2>You have not completed any orders</h2>
                  </Row>
                  <Row
                    className="justify-content-center"
                    style={{ fontSize: "1.5rem" }}
                  >
                    <Link href="/">
                      <a>Continue</a>
                    </Link>
                  </Row>
                </div>
              </Container>
            </>
          )
        ) : (
          <>
            <Container>
              <Row
                className="justify-content-center"
                style={{ marginTop: "2rem", marginBottom: "1rem" }}
              >
                <h3>Not Authorized! Please Login</h3>
              </Row>
            </Container>
          </>
        )
      ) : (
        <>
          <Container>
            <Row
              className="justify-content-center"
              style={{ marginTop: "2rem", marginBottom: "1rem" }}
            >
              <h3>Loading Your Orders. Please Wait...</h3>
            </Row>
          </Container>
        </>
      )}
      <LoginModal
        show={loginModalShow}
        onHide={() => setLoginModalShow(false)}
        modalShow={setLoginModalShow}
      />
      <OrderDetailsModal
        show={orderModalShow}
        onHide={() => setOrderModalShow(false)}
        modalShow={setOrderModalShow}
        modalData={orderData}
      />
    </Container>
  );
}

export default orders;
