import React from "react";
import Modal from "react-bootstrap/Modal";
import Styles from "../styles/SignUpStyle.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckSquare,
  faExclamationCircle,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import Spinner from "react-bootstrap/Spinner";
function SignUpModal({ show, onHide, modalMessage }) {
  if (modalMessage.type === "dbError") {
    return (
      <Modal
        show={show}
        onHide={onHide}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body className={Styles.customErrorModalBody + " text-center"}>
          <FontAwesomeIcon icon={faExclamationCircle} color="red" size="6x" />
          <h4 className={Styles.message}>Database Error</h4>
          <h6 className={Styles.redirectMessage}>
            Error Code : {modalMessage.code}
          </h6>
        </Modal.Body>
      </Modal>
    );
  } else if (modalMessage.type === "otherError") {
    return (
      <Modal
        show={show}
        onHide={onHide}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body className={Styles.customErrorModalBody + " text-center"}>
          <FontAwesomeIcon icon={faExclamationCircle} color="red" size="6x" />
          <h4 className={Styles.message}>Network Error</h4>
          <h6 className={Styles.redirectMessage}>
            Error Code : {modalMessage.code}
          </h6>
        </Modal.Body>
      </Modal>
    );
  } else if (modalMessage.type === "appError") {
    return (
      <Modal
        show={show}
        onHide={onHide}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body className={Styles.customErrorModalBody + " text-center"}>
          <FontAwesomeIcon icon={faExclamationCircle} color="red" size="6x" />
          <h4 className={Styles.message}>Application Error</h4>
          <h6 className={Styles.redirectMessage}>
            Error Code : {modalMessage.code}
          </h6>
        </Modal.Body>
      </Modal>
    );
  } else {
    return (
      <Modal
        show={show}
        onHide={onHide}
        backdrop="static"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body className={Styles.customSuccessModalBody + " text-center"}>
          <FontAwesomeIcon icon={faCheckCircle} color="green" size="6x" />
          <h4 className={Styles.message}>Thank You For Joining Us</h4>
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
          <h6 className={Styles.redirectMessage}>Redirecting to main page</h6>
        </Modal.Body>
      </Modal>
    );
  }
}

export default SignUpModal;
