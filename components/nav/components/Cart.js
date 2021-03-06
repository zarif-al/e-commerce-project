import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faTrash,
  faPlusCircle,
  faMinusCircle,
  faMinusSquare,
  faPlusSquare,
} from "@fortawesome/free-solid-svg-icons";
import useSWR from "swr";
import styles from "../../../styles/nav/components/Cart.module.css";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Spinner from "react-bootstrap/Spinner";
import { itemCount, cartTotal, cartAction } from "../../../functions/functions";
import Button from "react-bootstrap/Button";
import { mutate } from "swr";
function Cart({ handleOverlay }) {
  //Not the best solution. Recommend to go back.
  //states
  const fetcher = (url) => fetch(url).then((r) => r.json());
  const { data, error, isValidating } = useSWR("/api/cartApi", fetcher);
  const [drop, setDrop] = useState(false);
  //Overlay on removed Item
  const [removedItems, setRemovedItem] = useState([]);

  //Drop state changer
  const changeDrop = () => {
    handleOverlay();
    setDrop(!drop);
  };
  //motion framer settings
  const dropdown = {
    visible: {
      right: 0,
      transition: { duration: 0.3 },
    },
    hidden: {
      right: "-100%",
      transition: { duration: 0.3 },
    },
  };
  //cart variable
  let cart = null;
  if (data && !error) {
    cart = data.cart;
  }
  //useEffect
  useEffect(() => {
    let currentArray_removal = removedItems.filter((removedItems) =>
      data.cart.some((items) => items.id == removedItems)
    );
    setRemovedItem(currentArray_removal);
  }, [data]);
  //remove item from cart function
  const removeItem = async (id) => {
    let currentArray = removedItems;
    currentArray.push(id);
    setRemovedItem(currentArray);
    const item = {
      id: id,
      action: "delete",
    };
    const resp = await cartAction(item);
    if (resp == "success") {
      mutate("/api/cartApi");
    }
  };
  //decrement item from cart function
  const decrementItem = async (id) => {
    const currentItem = cart.find((item) => item.id === id);
    if (currentItem.quantity === 1) {
      removeItem(id);
    } else {
      const item = {
        id: id,
        action: "removeOne",
      };
      const resp = await cartAction(item);
      if (resp == "success") {
        mutate("/api/cartApi");
      }
    }
  };
  //increment item from cart function
  const incrementItem = async (id) => {
    const item = {
      id: id,
      action: "addOne",
    };
    const resp = await cartAction(item);
    if (resp == "success") {
      mutate("/api/cartApi");
    }
  };
  return (
    <div>
      <div
        className={
          drop ? styles.backdrop + " " + styles.active : styles.backdrop
        }
        onClick={() => {
          handleOverlay();
          changeDrop();
        }}
      ></div>
      <a
        className={styles.cart_btn}
        onClick={changeDrop}
        style={{ zIndex: drop ? 5 : 1 }}
      >
        <span className="fa-layers fa-fw">
          <FontAwesomeIcon icon={faShoppingCart} color="black" />
          <span
            className="fa-layers-counter fa-layers-top"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2.3rem",
              padding: "0.5rem",
            }}
          >
            {cart == null ? (
              <Spinner animation="border" style={{ fontSize: "2.2rem" }} />
            ) : (
              itemCount(cart)
            )}
          </span>
        </span>
      </a>
      <motion.div
        className={styles.slider}
        initial={"hidden"}
        animate={drop ? "visible" : "hidden"}
        variants={dropdown}
      >
        {cart === null ? (
          <div className={styles.noItems}>Loading Cart...</div>
        ) : cart.length === 0 ? (
          <div className={styles.noItems}>No Items Added Yet!</div>
        ) : (
          <div className={styles.itemsContainer}>
            {cart.map((item) => {
              return (
                <div className={styles.itemContainer} key={item.id}>
                  <div
                    className={styles.loadingDiv}
                    style={{
                      display: removedItems.includes(item.id) ? "flex" : "none",
                    }}
                  >
                    <Spinner
                      animation="border"
                      style={{ opacity: 1, color: "white" }}
                    />
                  </div>
                  <div className={styles.item}>
                    <div className={styles.imageContainer}>
                      <img src={item.image} className={styles.image} />
                    </div>
                    <div className={styles.name_quantity}>
                      <div>{item.name}</div>
                      <div>
                        <span className={styles.priceHighlight}>
                          &#36;{item.price}
                        </span>{" "}
                        X {item.quantity} =
                        <span className={styles.priceHighlight}>
                          &#36;{item.quantity * item.price}
                        </span>
                      </div>
                    </div>
                    <div className={styles.control_buttons}>
                      <div
                        className={styles.trash}
                        onClick={() => {
                          removeItem(item.id);
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} size="xs" />
                      </div>
                      <div
                        className={styles.plus}
                        onClick={() => {
                          incrementItem(item.id);
                        }}
                      >
                        <FontAwesomeIcon icon={faPlusSquare} size="xs" />
                      </div>
                      <div
                        className={styles.minus}
                        onClick={() => {
                          decrementItem(item.id);
                        }}
                      >
                        <FontAwesomeIcon icon={faMinusSquare} size="xs" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className={styles.checkoutDiv}>
          <div className={styles.total}>
            <div>Total</div>
            <div>&#36;{cartTotal(cart)}</div>
          </div>
          <div className={styles.purchaseButton}>
            <Button variant="outline-dark" disabled={true} block>
              Stripe Checkout Coming Soon!
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Cart;
