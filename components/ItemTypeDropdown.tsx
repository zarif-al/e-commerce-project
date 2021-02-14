import React from "react";
import NavDropdown from "react-bootstrap/NavDropdown";
function ItemTypeDropdown({
  setItemOption,
  itemOption,
  setForcePage,
  setLowerLimit,
  types,
  setSearchValue,
}) {
  var options = [];
  types.forEach((type) => {
    options.push(
      <NavDropdown.Item
        onClick={() => {
          setItemOption(type);
          setLowerLimit(0);
          setForcePage(0);
          setSearchValue("");
        }}
        key={type}
      >
        {type}
      </NavDropdown.Item>
    );
  });
  return (
    <>
      <NavDropdown title={itemOption} id="basic-nav-dropdown">
        <NavDropdown.Item
          onClick={() => {
            setItemOption("All");
            setSearchValue("");
          }}
        >
          All
        </NavDropdown.Item>
        {options}
      </NavDropdown>
    </>
  );
}

export default ItemTypeDropdown;
