import React from "react";
import NavDropdown from "react-bootstrap/NavDropdown";
function ShowLimitDropdown({
  showLimit,
  setShowLimit,
  setForcePage,
  setLowerLimit,
}) {
  return (
    <>
      <NavDropdown title={showLimit} id="basic-nav-dropdown">
        <NavDropdown.Item
          onClick={() => {
            setShowLimit(21);
            setLowerLimit(0);
            setForcePage(0);
          }}
        >
          21
        </NavDropdown.Item>
        <NavDropdown.Item
          onClick={() => {
            setShowLimit(24);
            setLowerLimit(0);
            setForcePage(0);
          }}
        >
          24
        </NavDropdown.Item>
        <NavDropdown.Item
          onClick={() => {
            setShowLimit(48);
            setLowerLimit(0);
            setForcePage(0);
          }}
        >
          48
        </NavDropdown.Item>
        <NavDropdown.Item
          onClick={() => {
            setShowLimit(75);
            setLowerLimit(0);
            setForcePage(0);
          }}
        >
          75
        </NavDropdown.Item>
        <NavDropdown.Item
          onClick={() => {
            setShowLimit(90);
            setLowerLimit(0);
            setForcePage(0);
          }}
        >
          90
        </NavDropdown.Item>
      </NavDropdown>
    </>
  );
}

export default ShowLimitDropdown;
