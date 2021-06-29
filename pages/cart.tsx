import React, { useRef } from "react";
import Container from "react-bootstrap/Container";
import NavBar from "../components/nav/Nav";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Link from "next/link";
import Image from "react-bootstrap/Image";
import { mutate } from "swr";
import Form from "react-bootstrap/Form";
import OrderModal from "../components/orderModal";
import {
  faTimesCircle,
  faArrowCircleLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { itemCount, cartAction } from "../functions/functions";
import WarningModal from "../components/WarningModal";
import { useSession, getSession } from "next-auth/client";
import { connectToDatabase } from "../utils/mongodb";
import { verify } from "jsonwebtoken";
import { ObjectID } from "mongodb";
import cookie from "cookie";
import styles from "../styles/Cart.module.css";
function cart({ initialData }) {
  const router = useRouter();
  const [session, loading] = useSession();
  const [orderModalShow, setOrderModalShow] = useState(false);
  const [warningModalShow, setWarningModalShow] = useState(false);
  const [orderModalData, setOrderModalData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    city: "",
    address: "",
    type: "",
    total: 0,
    itemCount: 0,
    cart: [],
    id: "",
  });
  const [quantityError, setQuantityError] = useState({
    exists: false,
    message: "",
  });
  const [cart, setCart] = useState(initialData);
  const fetcher = (url) => fetch(url).then((r) => r.json());
  const { data, error, isValidating } = useSWR("/api/cartApi", fetcher);
  if (data != undefined) {
    if (JSON.stringify(data) != JSON.stringify(cart)) {
      setCart(data);
    }
  }
  const refs = useRef({});
  let sum = 0;

  const updateCart = async (index) => {
    if (refs.current[index].value >= 1) {
      refs.current[index].className = "form-control is-valid";
      const item = {
        id: cart.data[0].cart[index].id,
        quantity: Number(refs.current[index].value),
        action: "addMultiple",
      };
      const resp = await cartAction(item);
      if (resp === "success") {
        mutate("/api/cartApi");
      }
    } else {
      if (refs.current[index].className === "form-control is-valid") {
        setQuantityError({
          exists: true,
          message: `Please Check Quantity For ${cart.data[0].cart[index].name}`,
        });
        refs.current[index].className = "form-control is-invalid";
      }
    }
  };

  const redirect = async (order) => {
    await fetch("/api/sslConnection", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    })
      .then((res) => res.json())
      .then((result) => {
        router.push(result.GatewayPageURL);
      });
  };

  const showWarning = (order) => {
    setOrderModalShow(false);
    setOrderModalData(order);
    setWarningModalShow(true);
  };

  const addToOrder = async () => {
    orderModalData.type = "INSERT";
    orderModalData.total = sum;
    orderModalData.itemCount = itemCount(cart);
    orderModalData.cart = cart.data[0].cart;
    orderModalData.id = new Date()
      .toLocaleTimeString()
      .replace(/[A-Z-:' ']/g, "");
    await fetch("/api/orderApi", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderModalData),
    })
      .then((res) => res.json())
      .then(async (result) => {
        setOrderModalShow(false);
        mutate("/api/cartApi");
        redirect(result.data);
      });
  };

  const removeItem = async (index) => {
    const item = {
      id: cart.data[0].cart[index].id,
      action: "delete",
    };
    const resp = await cartAction(item);
    if (resp === "success") {
      mutate("/api/cartApi");
    }
  };

  const clearCart = async () => {
    const item = {
      action: "clear",
    };
    const resp = await cartAction(item);
    if (resp === "success") {
      mutate("/api/cartApi");
    }
  };

  const handleSubmit = () => {
    if (quantityError.exists === true) {
      alert(quantityError.message);
    } else {
      //modal
      if (!session) {
        setOrderModalData({
          name: "",
          email: "",
          phoneNumber: "",
          city: "",
          address: "",
          type: "",
          total: 0,
          itemCount: 0,
          cart: [],
          id: "",
        });
        setOrderModalShow(true);
      } else {
        setOrderModalData({
          name: session.user.name,
          email: session.user.email,
          phoneNumber: "",
          address: "",
          city: "",
          type: "",
          total: 0,
          itemCount: 0,
          cart: [],
          id: "",
        });
        setOrderModalShow(true);
      }
    }
  };

  const getItems = () => {
    if (itemCount(cart) === 0) {
      return (
        <div className="border border-primary">
          <Row className="justify-content-center">
            <h2>You have no items in your shopping cart</h2>
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
      );
    } else {
      const rows = [];
      rows.push(
        <Row className="text-center" key="header">
          <Col className={styles.tableCol}>
            <strong>Image</strong>
          </Col>
          <Col className={styles.tableCol}>
            <strong>Product Name</strong>
          </Col>
          <Col className={styles.tableCol}>
            <strong>Quantity</strong>
          </Col>
          <Col className={styles.tableCol}>
            <strong>Unit Price</strong>
          </Col>
          <Col className={styles.tableCol}>
            <strong>Total Price</strong>
          </Col>
        </Row>
      );

      cart.data[0].cart.forEach((items, index) => {
        sum += items.price * items.quantity;
        rows.push(
          <Row
            className="text-center border border-dark align-items-center"
            key={items.id}
          >
            <Col>
              <Image
                src={items.image}
                style={{
                  width: 151,
                  height: 160,
                  objectFit: "cover",
                  paddingTop: "0.5rem",
                }}
                rounded
              />
            </Col>
            <Col>{items.name}</Col>
            <Col>
              <Form.Row
                onSubmit={(e) => {
                  e.preventDefault();
                }}
                className="align-items-center"
              >
                <Col xs={9}>
                  <Form.Control
                    ref={(ref) => (refs.current[index] = ref)}
                    type="number"
                    min="1"
                    name={"Item" + index}
                    onChange={() => {
                      updateCart(index);
                    }}
                    onWheel={(e) => {
                      e.target.blur();
                    }}
                    defaultValue={items.quantity}
                    isValid={true}
                  />
                </Col>
                <Col xs={3} className="justify-content-center ">
                  <Button
                    style={{
                      border: "none",
                      backgroundColor: "transparent",
                      outline: "none",
                    }}
                    onClick={() => {
                      removeItem(index);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faTimesCircle}
                      color="red"
                      size="lg"
                    />
                  </Button>
                </Col>
              </Form.Row>
            </Col>
            <Col>Tk {items.price}</Col>
            <Col>Tk {items.price * items.quantity}</Col>
          </Row>
        );
      });
      rows.push(
        <div key="footerRows">
          <Row
            className="text-center border border-dark"
            style={{
              paddingTop: "0.5rem",
              paddingBottom: "0.5rem",
              borderWidth: "2rem",
            }}
          >
            <Col></Col>
            <Col></Col>
            <Col></Col>
            <Col className="font-weight-bold">Total</Col>
            <Col className="font-weight-bold">Tk {sum}</Col>
          </Row>
          <Row
            className="justify-content-end"
            style={{ marginTop: "1rem", marginBottom: "1rem" }}
            noGutters={true}
          >
            <Button
              style={{ marginRight: "1rem" }}
              onClick={() => {
                clearCart();
              }}
              key={"homeButton"}
              variant="danger"
            >
              Delete Cart
            </Button>
            <Button
              variant="success"
              onClick={handleSubmit}
              key={"confirmButton"}
              disabled={isValidating}
            >
              Confirm
            </Button>
          </Row>
        </div>
      );
      return <>{rows}</>;
    }
  };

  return (
    <Container fluid style={{ padding: "0" }}>
      <NavBar screen="home" />
      <Container style={{ marginBottom: "4.5rem" }}>
        <Row
          style={{ marginBottom: "0.5rem", marginTop: "2rem" }}
          className="align-items-center"
        >
          <Col className="text-center">
            <h1>Shopping Cart</h1>
          </Col>
        </Row>
        {itemCount(cart) != 0 ? (
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
        ) : null}

        {getItems()}
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
      <OrderModal
        show={orderModalShow}
        onHide={() => setOrderModalShow(false)}
        data={orderModalData}
        onConfirm={showWarning}
      />
      <WarningModal
        show={warningModalShow}
        onHide={() => setWarningModalShow(false)}
        onConfirm={addToOrder}
      />
    </Container>
  );
}

export default cart;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const { db } = await connectToDatabase();
  if (session) {
    const cart = await db
      .collection("users")
      .find({ email: session.user.email })
      .project({ _id: 0, cart: 1 })
      .toArray();
    if (cart[0].cart === undefined) {
      return {
        props: {},
      };
    }
    let initialData = { message: "ok", data: [{ cart: cart[0].cart }] };
    return {
      props: { initialData },
    };
  } else {
    const { SECRET } = process.env;
    const parsedCookies = cookie.parse(context.req.headers.cookie);
    const initialData = await verify(
      parsedCookies.tempAuth,
      SECRET,
      async function (err, decoded) {
        if (!err && decoded) {
          const temp_id = new ObjectID(decoded.sub);
          const cart = await db
            .collection("tempUser")
            .find({ _id: temp_id })
            .project({ _id: 0, cart: 1 })
            .toArray();
          return { message: "ok", data: cart };
        } else {
          return { message: "ok", data: [{ cart: [] }] };
        }
      }
    );

    return {
      props: { initialData },
    };
  }
}
