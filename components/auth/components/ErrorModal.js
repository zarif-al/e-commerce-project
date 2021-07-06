import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../../../styles/authentication/components/ErrorModal.module.css";
function ErrorModal({ show, onHide, message }) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <div className={styles.modalContainer}>
        <Modal.Title className={styles.title}>Error!</Modal.Title>
        <Modal.Body>
          <p className={styles.body}>{message}</p>
        </Modal.Body>
      </div>
    </Modal>
  );
}

export default ErrorModal;
