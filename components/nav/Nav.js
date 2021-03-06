import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faSignInAlt,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Spinner from "react-bootstrap/Spinner";
import { signIn, useSession } from "next-auth/client";
import InSession from "./components/inSession";
import Cart from "./components/Cart";
import styles from "../../styles/nav/Nav.module.css";
import SideNav from "./components/SideNav";
function NavBar({ screen, handleOverlay, categories }) {
  const [session, loading] = useSession();
  const toggle = () => {
    return (
      <>
        <Nav>
          {loading ? (
            <>
              <Nav.Link style={{}} disabled={true} className={styles.spinner}>
                <Spinner
                  animation="border"
                  role="status"
                  variant="dark"
                  size="sm"
                />
              </Nav.Link>
            </>
          ) : session ? (
            <InSession handleOverlay={handleOverlay} session={session} />
          ) : (
            <>
              <Nav.Link onClick={() => signIn()} className={styles.signInBtn}>
                <FontAwesomeIcon icon={faSignInAlt} color="black" />
              </Nav.Link>
            </>
          )}
          <Cart handleOverlay={handleOverlay} />
        </Nav>
      </>
    );
  };

  return (
    <Navbar
      variant="dark"
      className={styles.mainNav + " justify-content-between"}
    >
      <div className={styles.sideMenuToggle}>
        <SideNav categories={categories} handleOverlay={handleOverlay} />
      </div>
      <Nav.Link className={styles.brandName}>
        <h4>Ecommerce Demo</h4>
      </Nav.Link>
      {/*         <img src="/logo.png" height="36rem" /> */}
      {toggle()}
    </Navbar>
  );
}

export default NavBar;
