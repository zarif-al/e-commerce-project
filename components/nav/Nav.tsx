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
import useSWR from "swr";
import { itemCount } from "../../functions/functions";
import { useRouter } from "next/router";
import Spinner from "react-bootstrap/Spinner";
import { signIn, signOut, useSession } from "next-auth/client";
import InSession from "./components/inSession";
import styles from "../../styles/Nav.module.css";
function NavBar({ screen, showSidebar }) {
  const [session, loading] = useSession();
  const router = useRouter();
  const fetcher = (url) => fetch(url).then((r) => r.json());
  const { data, error, isValidating } = useSWR("/api/cartApi", fetcher);

  const toggle = () => {
    if (screen === "signUp") {
      return null;
    }
    if (screen === "home") {
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
              <InSession />
            ) : (
              <>
                <Nav.Link onClick={() => signIn()} className={styles.signInBtn}>
                  <FontAwesomeIcon icon={faSignInAlt} color="black" />
                </Nav.Link>
              </>
            )}
            <Link href="/cart" passHref>
              <Nav.Link className={styles.cartBtn}>
                <span className="fa-layers fa-fw">
                  <FontAwesomeIcon icon={faShoppingCart} color="black" />
                  <span
                    className="fa-layers-counter fa-layers-top"
                    style={{ fontSize: "2rem" }}
                  >
                    {isValidating || data === undefined ? (
                      <Spinner
                        animation="border"
                        style={{ marginBottom: "1rem" }}
                      />
                    ) : (
                      itemCount(data)
                    )}
                  </span>
                </span>
              </Nav.Link>
            </Link>
          </Nav>
        </>
      );
    }
  };

  return (
    <Navbar
      variant="dark"
      style={{ fontSize: "1.3rem", backgroundColor: "#020202bf" }}
      className="justify-content-between"
    >
      <Nav.Link onClick={showSidebar} className={styles.sideMenuToggle}>
        <FontAwesomeIcon icon={faBars} color="white" />
      </Nav.Link>
      <Nav.Link className={styles.brandName}>
        <h4>Ecommerce Demo</h4>
      </Nav.Link>
      {/*         <img src="/logo.png" height="36rem" /> */}
      {toggle()}
    </Navbar>
  );
}

export default NavBar;
