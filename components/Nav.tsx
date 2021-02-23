import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faUser,
  faStoreAlt,
  faSignOutAlt,
  faSignInAlt,
  faListAlt,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import useSWR from "swr";
import { itemCount } from "../functions/functions";
import { useRouter } from "next/router";
import Spinner from "react-bootstrap/Spinner";
import { signIn, signOut, useSession } from "next-auth/client";
import Dropdown from "react-bootstrap/Dropdown";
function NavBar({ screen }) {
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
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-end"
          >
            <Nav>
              {loading ? (
                <>
                  <Nav.Link
                    onClick={() => signIn()}
                    style={{
                      color: "black",
                      backgroundColor: "white",
                      borderRadius: "5px",
                      fontSize: "1.1rem",
                    }}
                  >
                    <Spinner
                      animation="border"
                      role="status"
                      variant="dark"
                      size="sm"
                    />{" "}
                    Loading...
                  </Nav.Link>
                </>
              ) : session ? (
                <Dropdown className="align-self-center">
                  <Dropdown.Toggle
                    style={{ backgroundColor: "white", color: "black" }}
                  >
                    <img
                      src={
                        session.user.image
                          ? session.user.image
                          : "/defaultIcon.png"
                      }
                      style={{ height: "28px" }}
                    ></img>{" "}
                    {session.user.name ? session.user.name : "Account"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => {
                        router.push("/orders");
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faListAlt}
                        color="black"
                        size="lg"
                      />{" "}
                      My Orders
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => signOut()}>
                      <FontAwesomeIcon
                        icon={faSignOutAlt}
                        color="black"
                        size="lg"
                      />{" "}
                      Sign Out
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <>
                  <Nav.Link
                    onClick={() => signIn()}
                    style={{
                      color: "black",
                      backgroundColor: "white",
                      borderRadius: "5px",
                      fontSize: "1.1rem",
                    }}
                  >
                    <FontAwesomeIcon icon={faSignInAlt} color="black" /> Sign In
                  </Nav.Link>
                </>
              )}
              <Link href="/cart" passHref>
                <Nav.Link
                  style={{
                    color: "black",
                    marginLeft: "1rem",
                    backgroundColor: "white",
                    borderRadius: "5px",
                    fontSize: "1.1rem",
                  }}
                  className="align-self-center"
                >
                  <span
                    className="fa-layers fa-fw"
                    style={{ marginRight: "0.5rem" }}
                  >
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
                  Your Cart
                </Nav.Link>
              </Link>
            </Nav>
          </Navbar.Collapse>
        </>
      );
    }
  };

  return (
    <Navbar
      bg="dark"
      variant="light"
      expand="lg"
      sticky="top"
      style={{ fontSize: "1.3rem" }}
      className="justify-content-start"
    >
      <Navbar.Brand>
        <img src="/logo.png" height="36rem" />
      </Navbar.Brand>
      {toggle()}
    </Navbar>
  );
}

export default NavBar;
