import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useState } from "react";
import Link from "next/link";
import Table from "react-bootstrap/Table";
function OrderDetailsModal({ show, onHide, modalShow, modalData }) {
  if (modalData != null) {
    const { orderId, createdAt, address, items } = modalData;
    let rows = [];
    let sum = 0;
    items.forEach((item, index) => {
      sum += item.price;
      rows.push(
        <tr>
          <td>{index + 1}</td>
          <td>{item.name}</td>
          <td>{item.quantity}</td>
          <td>Tk {item.price}</td>
        </tr>
      );
    });

    rows.push(
      <tr>
        <td colSpan={2} className="text-right">
          <strong>Total</strong>
        </td>
        <td colSpan={2} className="text-center">
          <strong>Tk {sum}</strong>
        </td>
      </tr>
    );
    return (
      <Modal
        show={show}
        onHide={onHide}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton className="border-0 text-center pb-0">
          <Modal.Title className="w-100">Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="text-center mb-3">
            <Col>
              <strong>Order ID</strong> : {orderId}
            </Col>
            <Col>
              <strong>Date</strong> : {createdAt.slice(0, 9)}
            </Col>
            <Col>
              <strong>Time</strong> : {createdAt.slice(11, 15)}{" "}
            </Col>
          </Row>
          <Row>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          </Row>
        </Modal.Body>
      </Modal>
    );
  } else {
    return <></>;
  }
}

export default OrderDetailsModal;
