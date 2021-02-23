import React, { useState, useEffect } from "react";
import useSWR from "swr";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Link from "next/link";
import NavBar from "../components/Nav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import OrderDetailsModal from "../components/OrderDetailsModal";
import { connectToDatabase } from "../utils/mongodb";
import { getSession } from "next-auth/client";
import { useRouter } from "next/router";
function orders({ initialData }) {
  const router = useRouter();
  const fetcher = (url) => fetch(url).then((r) => r.json());
  const [orders, setOrders] = useState(initialData);
  const { data } = useSWR("/api/orderApi", fetcher);
  const [orderModalShow, setOrderModalShow] = useState(false);
  const [orderData, setOrderData] = useState(null);
  let rows = [];
  useEffect(() => {
    if (orders.message === "error") {
      router.push("/");
    }
  });
  if (data != undefined) {
    if (JSON.stringify(data) != JSON.stringify(orders)) {
      setOrders(data);
    }
  }

  const setupModal = (index) => {
    setOrderData(data.order[index]);
    setOrderModalShow(true);
  };

  if (orders.message != "error" && orders.order.length != 0) {
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

    for (var i = 0; i < orders.order.length; i++) {
      let sum = 0;
      orders.order[i].items.forEach((item) => {
        sum += item.quantity * item.price;
      });
      let index = i;
      const { orderId, createdAt, address } = orders.order[i];
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
          <Col
            style={{
              color: orders.order[i].payStatus === "VALID" ? "green" : "red",
            }}
          >
            {orders.order[i].payStatus}
          </Col>
        </Row>
      );
    }
  }

  return (
    <Container fluid style={{ padding: "0" }}>
      <NavBar screen="home" />
      {orders.message != "error" ? (
        orders.order.length != 0 ? (
          <>
            <Container>
              <Row
                className="justify-content-center"
                style={{ marginTop: "2rem", marginBottom: "0.5rem" }}
              >
                <h3>Your Orders</h3>
              </Row>
              <Row style={{ marginBottom: "1rem" }}>
                <Col
                  xs={2}
                  style={{
                    color: "blue",
                  }}
                >
                  <Link href="/" passHref>
                    <a>
                      <FontAwesomeIcon
                        icon={faArrowCircleLeft}
                        color="black"
                        size="lg"
                      />{" "}
                      Back to Store
                    </a>
                  </Link>
                </Col>
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
                    <a style={{ color: "blue" }}>Continue</a>
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
              <h1>Orders</h1>
            </Row>
            <div className="border border-primary">
              <Row
                className="justify-content-center"
                style={{ padding: "5rem" }}
              >
                <h2>You will be redirected to Home Page</h2>
              </Row>
            </div>
          </Container>
        </>
      )}

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

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const { db } = await connectToDatabase();
  if (session) {
    const orders = await db
      .collection("orders")
      .find({ email: session.user.email, userType: 1 })
      .project({ _id: 0 })
      .toArray();
    const initialData = { message: "success", order: orders };
    return {
      props: { initialData },
    };
  } else {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
}
