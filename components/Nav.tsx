import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faUser } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { NavDropdown } from "react-bootstrap";
import { mutate } from "swr";
import useSWR from "swr";
import { itemCount } from "../functions/functions";
import { useRouter } from "next/router";
import Spinner from "react-bootstrap/Spinner";
function NavBar({ screen, modalShow }) {
  const router = useRouter();
  const fetcher = (url) => fetch(url).then((r) => r.json());
  const { data, error, isValidating } = useSWR("/api/userApi", fetcher);
  const loginStatus =
    data != undefined ? (data.message != "authUser" ? false : true) : false;

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
            className="mr-10 justify-content-end"
          >
            <Nav>
              {loginStatus === false ? (
                <>
                  <Nav.Link
                    onClick={() => {
                      modalShow(true);
                    }}
                    style={{ color: "white" }}
                  >
                    <FontAwesomeIcon icon={faUser} color="green" /> Log In/Sign
                    Up
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
                  <NavDropdown.Item
                    onClick={() => {
                      fetch("/api/loginApi", {
                        method: "GET",
                        headers: {
                          Accept: "application/json",
                          "Content-Type": "application/json",
                        },
                      }).then((res) => {
                        router.push("/");
                        mutate("/api/userApi");
                      });
                    }}
                  >
                    Log Out
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
                      {isValidating ? (
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
      variant="dark"
      expand="lg"
      sticky="top"
      className="py-2"
      style={{ fontSize: "1.3rem" }}
    >
      <Link href="/" passHref>
        <Navbar.Brand>E-commerce</Navbar.Brand>
      </Link>
      {/*  <Link href="/" passHref>
        <Nav.Link style={{ color: "white" }}>Home</Nav.Link>
      </Link> */}
      {toggle()}
    </Navbar>
  );
}

export default NavBar;
