import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Styles from "../styles/Login.module.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function WarningMOdal({ show, onHide, onConfirm }) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      <Modal.Header className="text-center">
        <Modal.Title className="w-100">
          <FontAwesomeIcon icon={faExclamationTriangle} color="red" size="lg" />{" "}
          Note{" "}
          <FontAwesomeIcon icon={faExclamationTriangle} color="red" size="lg" />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row className="text-center">
            You will be redirected to a sandbox environment of SSLCOMMERZ
            payment portal. On payment process completion you will be redirected
            to the main page. If you want to make a dummy payment using credit
            cards then you can use the following information.
          </Row>
          <Row style={{ paddingTop: "1rem" }}>
            <Col xs={4} className="border border-primary">
              <strong>Card Type</strong>
            </Col>
            <Col xs={4} className="border border-primary">
              <strong>Card Number</strong>
            </Col>
            <Col xs={2} className="border border-primary">
              <strong>EXP</strong>
            </Col>
            <Col xs={2} className="border border-primary">
              <strong>CVV</strong>
            </Col>
          </Row>
          <Row>
            <Col xs={4} className="border border-primary">
              VISA
            </Col>
            <Col xs={4} className="border border-primary">
              4111111111111111
            </Col>
            <Col xs={2} className="border border-primary">
              12/25
            </Col>
            <Col xs={2} className="border border-primary">
              111
            </Col>
          </Row>
          <Row>
            <Col xs={4} className="border border-primary">
              MASTERCARD
            </Col>
            <Col xs={4} className="border border-primary">
              4111111111111111
            </Col>
            <Col xs={2} className="border border-primary">
              12/25
            </Col>
            <Col xs={2} className="border border-primary">
              111
            </Col>
          </Row>
          <Row>
            <Col xs={4} className="border border-primary">
              American Express
            </Col>
            <Col xs={4} className="border border-primary">
              3711111111111111
            </Col>
            <Col xs={2} className="border border-primary">
              12/25
            </Col>
            <Col xs={2} className="border border-primary">
              111
            </Col>
          </Row>
          <Row>
            <Col className="border border-primary">
              Mobile OTP: 111111 or 123456
            </Col>
          </Row>
          <Row style={{ paddingTop: "1rem" }}>
            <Col>
              <Button
                variant="success"
                onClick={() => {
                  onConfirm();
                }}
                block
              >
                Confirm
              </Button>
            </Col>
            <Col>
              <Button
                variant="warning"
                onClick={() => {
                  onHide();
                }}
                block
              >
                Cancel
              </Button>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
}

export default WarningMOdal;
