import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faTrash } from "@fortawesome/free-solid-svg-icons";
import useSWR from "swr";
import styles from "../../../styles/nav/components/Cart.module.css";
import { useState } from "react";
import { motion } from "framer-motion";
import Spinner from "react-bootstrap/Spinner";
import { itemCount, cartTotal, cartAction } from "../../../functions/functions";
import Button from "react-bootstrap/Button";
import { mutate } from "swr";
function Cart({ handleOverlay }) {
  //states
  const fetcher = (url) => fetch(url).then((r) => r.json());
  const { data, error, isValidating } = useSWR("/api/cartApi", fetcher);
  const [drop, setDrop] = useState(false);
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
  //holding cart, might switch to directly using data
  let cart = null;
  if (data != undefined) {
    if (data.data[0].cart !== undefined) {
      cart = data.data[0].cart;
    }
  }
  //
  //remove item from cart function
  const removeItem = async (index) => {
    const item = {
      id: cart[index].id,
      action: "delete",
    };
    const resp = await cartAction(item);
    if (resp === "success") {
      mutate("/api/cartApi");
    }
  };
  return (
    <>
      <div
        className={
          drop ? styles.backdrop + " " + styles.active : styles.backdrop
        }
        onClick={() => {
          handleOverlay();
          changeDrop();
        }}
      ></div>
      {/*       <div className={styles.cart_sidebar}> */}
      <a className={styles.cart_btn} onClick={changeDrop}>
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
            {isValidating || data === undefined ? (
              <Spinner animation="border" style={{ fontSize: "2.2rem" }} />
            ) : (
              itemCount(data)
            )}
          </span>
        </span>
      </a>
      <motion.div
        id="myDropdown"
        className={styles.dropdownContent}
        initial={"hidden"}
        animate={drop ? "visible" : "hidden"}
        variants={dropdown}
      >
        {cart === null ? (
          <div>Loading Items</div>
        ) : cart.length === 0 ? (
          <div className={styles.noItems}>No Items Added Yet!</div>
        ) : (
          <div className={styles.itemsContainer}>
            {cart.map((item, i) => {
              return (
                <>
                  <div className={styles.item} key={item.id}>
                    <div className={styles.imageContainer}>
                      <img src={item.image} className={styles.image} />
                    </div>
                    <div className={styles.name_quantity}>
                      <div>{item.name}</div>
                      <div>
                        &#36;{item.price} X {item.quantity} = &#36;
                        {item.quantity * item.price}
                      </div>
                    </div>
                    <div
                      className={styles.trash}
                      onClick={() => {
                        removeItem(i);
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} color="grey" size="xs" />
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        )}
        <div className={styles.checkoutDiv}>
          <div className={styles.total}>
            <div>Total</div>
            <div>&#36;{cartTotal(data)}</div>
          </div>
          <div className={styles.purchaseButton}>
            <Button variant="outline-dark" disabled={true} block>
              Stripe Checkout Coming Soon!
            </Button>
          </div>
        </div>
      </motion.div>
      {/*     </div> */}
    </>
  );
}

export default Cart;
