import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faUser } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { NavDropdown } from "react-bootstrap";
import useSWR from "swr";
import { itemCount } from "../functions/functions";
import { useRouter } from "next/router";
import Spinner from "react-bootstrap/Spinner";
import { signIn, signOut, useSession } from "next-auth/client";

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
            className="justify-content-between"
          >
            <Nav.Link> </Nav.Link>
            <Nav.Link href="/" style={{ color: "white" }}>
              Home
            </Nav.Link>
            <Nav>
              {!session ? (
                <>
                  <Nav.Link onClick={() => signIn()} style={{ color: "white" }}>
                    <FontAwesomeIcon icon={faUser} color="green" /> Sign In
                  </Nav.Link>
                </>
              ) : (
                <NavDropdown title="My Account" id="basic-nav-dropdown">
                  <NavDropdown.Item
                    onClick={() => {
                      router.push("/orders");
                    }}
                  >
                    My Orders
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => signOut()}>
                    Sign Out
                  </NavDropdown.Item>
                </NavDropdown>
              )}
              <Link href="/cart" passHref>
                <Nav.Link style={{ color: "white" }}>
                  <span className="fa-layers fa-fw">
                    <FontAwesomeIcon icon={faShoppingCart} color="green" />
                    <span
                      className="fa-layers-counter"
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
                  </span>{" "}
                  Cart
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
      className="justify-content-center"
    >
      <Navbar.Brand>Ecommerce Demo</Navbar.Brand>

      {toggle()}
    </Navbar>
  );
}

export default NavBar;
