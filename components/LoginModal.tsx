import React from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import Styles from "../styles/Login.module.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useState } from "react";
import Link from "next/link";
import { mutate } from "swr";
function LoginModal({ show, onHide, modalShow }) {
  const [errorMessage, setErrorMessage] = useState("");

  const postData = async (formData) => {
    try {
      const res = await fetch("/api/loginApi", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        if (res.status === 600) {
          formik.setErrors({
            password: "Email/Password Mismatch",
            email: " ",
          });
        } else if (res.status === 700) {
          setErrorMessage("This account is already logged in.");
        } else {
          setErrorMessage("Database Error");
        }
      } else {
        modalShow(false);
        mutate("/api/userApi");
        mutate("/api/orderApi");
      }
    } catch (error) {
      formik.setErrors({ password: "Application Error" });
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      setErrorMessage("");
      const data = {
        email: escape(values.email),
        password: escape(values.password),
      };
      postData(data);
    },
  });
  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className="text-center">
        <Modal.Title className="w-100">Welcome Back</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit} noValidate>
          <Form.Group as={Row} controlId="formEmail">
            <Form.Label column sm={2}>
              Email
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="email"
                placeholder="Enter Your Email"
                name="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                autoComplete="username"
                isInvalid={formik.touched.email && !!formik.errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.email}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formPassword">
            <Form.Label column sm={2}>
              Password
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                isInvalid={formik.touched.password && !!formik.errors.password}
                autoComplete="current-password"
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.password}
              </Form.Control.Feedback>
            </Col>
          </Form.Group>
          {errorMessage ? (
            <div className={Styles.errorMessage}>{errorMessage}</div>
          ) : null}
          <Modal.Footer className="justify-content-between">
            <Button variant="primary" type="submit">
              Login
            </Button>
            <Link href="/signUpPage">New User?</Link>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default LoginModal;
