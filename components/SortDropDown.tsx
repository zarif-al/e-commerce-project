import React from "react";
import NavDropdown from "react-bootstrap/NavDropdown";
function SortDropdown({ setSortOption, sortOption }) {
  return (
    <>
      <NavDropdown title={sortOption} id="basic-nav-dropdown">
        <NavDropdown.Item
          onClick={() => {
            setSortOption("Default");
          }}
        >
          Default
        </NavDropdown.Item>
        <NavDropdown.Item
          onClick={() => {
            setSortOption("Price:Ascending");
          }}
        >
          Price : Ascending
        </NavDropdown.Item>
        <NavDropdown.Item
          onClick={() => {
            setSortOption("Price:Descending");
          }}
        >
          Price : Descending
        </NavDropdown.Item>
      </NavDropdown>
    </>
  );
}

export default SortDropdown;
