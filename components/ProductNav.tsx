import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faUser } from "@fortawesome/free-solid-svg-icons";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ItemTypeDropdown from "./ItemTypeDropdown";
import ShowLimitDropdown from "./ShowLimitDropdown";
import SortDropdown from "./SortDropDown";
import Col from "react-bootstrap/Col";
function ProductNav({
  showLimit,
  setShowLimit,
  itemOption,
  setItemOption,
  sortOption,
  setSortOption,
  setForcePage,
  setLowerLimit,
  setSearchValue,
  types,
  searchValue,
}) {
  const search = (e) => {
    e.preventDefault();
    setLowerLimit(0);
    setForcePage(0);
    setSearchValue(e.target[0].value);
  };
  return (
    <Navbar bg="light" expand="lg" style={{ fontSize: "1.3rem" }}>
      <Navbar.Toggle aria-controls="basic-navbar-nav">Filter</Navbar.Toggle>
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link disabled style={{ color: "black" }}>
            Show
          </Nav.Link>
          <ShowLimitDropdown
            showLimit={showLimit}
            setShowLimit={setShowLimit}
            setForcePage={setForcePage}
            setLowerLimit={setLowerLimit}
          />
          <Nav.Link disabled style={{ color: "black" }}>
            Item Type
          </Nav.Link>
          <ItemTypeDropdown
            itemOption={itemOption}
            setItemOption={setItemOption}
            setForcePage={setForcePage}
            setLowerLimit={setLowerLimit}
            types={types}
            setSearchValue={setSearchValue}
          />
          <Nav.Link disabled style={{ color: "black" }}>
            Sort
          </Nav.Link>
          <SortDropdown setSortOption={setSortOption} sortOption={sortOption} />
        </Nav>
        <Form
          inline
          onSubmit={(e) => {
            search(e);
          }}
        >
          <Col>
            <Form.Control
              type="text"
              placeholder="Search"
              className="mr-sm-2"
            />
          </Col>
          <Col>
            <Button variant="outline-success" type="submit">
              Search
            </Button>
          </Col>
        </Form>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default ProductNav;
