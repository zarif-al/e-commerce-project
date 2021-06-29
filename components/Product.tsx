import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import React, { useState } from "react";
import ProductColumns from "./ProductColumns";
import ReactPaginate from "react-paginate";
import ProductNav from "./ProductNav";
function Product({ items, setShow, types }) {
  const [lowerLimit, setLowerLimit] = useState(0);
  const [showLimit, setShowLimit] = useState(21);
  const [sortOption, setSortOption] = useState("Default");
  const [itemOption, setItemOption] = useState("All");
  const [length, setLength] = useState(items.length);
  const [forcePage, setForcePage] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  return (
    <Container fluid>
      <ProductNav
        showLimit={showLimit}
        setShowLimit={setShowLimit}
        itemOption={itemOption}
        setItemOption={setItemOption}
        sortOption={sortOption}
        setSortOption={setSortOption}
        setForcePage={setForcePage}
        setLowerLimit={setLowerLimit}
        setSearchValue={setSearchValue}
        types={types}
        searchValue={searchValue}
      />
      {/* <Container></Container> */}
      <Row
        className="justify-content-center align-items-center"
        style={{ marginLeft: "1.8rem" }}
      >
        <ProductColumns
          lowerLimit={lowerLimit}
          showLimit={showLimit}
          items={items}
          sortOption={sortOption}
          itemOption={itemOption}
          setLength={setLength}
          searchValue={searchValue}
          setShow={setShow}
        />
        {/*  <Container>
          <Row className="justify-content-center align-items-center">
            {length > 0 ? (
              <>
                <p className="text-muted" style={{ marginRight: "1rem" }}>
                  Page
                </p>
                <ReactPaginate
                  previousLabel={"previous"}
                  nextLabel={"next"}
                  breakLabel={"..."}
                  pageCount={Math.ceil(length / showLimit)}
                  marginPagesDisplayed={1}
                  pageRangeDisplayed={4}
                  onPageChange={(page) => {
                    setForcePage(page.selected);
                    setLowerLimit(page.selected * showLimit);
                    window.scrollTo(0, 0);
                  }}
                  subContainerClassName={"pages pagination"}
                  breakClassName={"page-item"}
                  breakLinkClassName={"page-link"}
                  containerClassName={"pagination"}
                  pageClassName={"page-item"}
                  pageLinkClassName={"page-link"}
                  previousClassName={"page-item"}
                  previousLinkClassName={"page-link"}
                  nextClassName={"page-item"}
                  nextLinkClassName={"page-link"}
                  activeClassName={"active"}
                  forcePage={forcePage}
                />
                <p className="text-muted" style={{ marginLeft: "1rem" }}>
                  Showing {lowerLimit + 1} to{" "}
                  {lowerLimit + showLimit < length
                    ? showLimit + lowerLimit
                    : length}{" "}
                  of {length}
                </p>{" "}
              </>
            ) : null}
          </Row>
        </Container> */}
      </Row>
    </Container>
  );
}

export default Product;
