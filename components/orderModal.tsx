import React from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import Styles from "../styles/Login.module.css";
import { useState } from "react";
import Link from "next/link";
import Row from "react-bootstrap/Row";
function OrderModal({ show, onHide, data, onConfirm }) {
  const formik = useFormik({
    initialValues: {
      name: data.name,
      email: data.email,
      address: data.address,
      city: data.city,
      phoneNumber: data.phoneNumber,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      city: Yup.string().required("Required"),
      address: Yup.string().required("Required"),
      phoneNumber: Yup.string().required("Required"),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      const data = {
        name: values.name,
        email: values.email,
        city: values.city,
        address: values.address,
        phoneNumber: values.phoneNumber,
        type: "",
        total: 0,
        itemCount: 0,
        cart: [],
        id: "",
      };

      onConfirm(data);
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
        <Modal.Title className="w-100">Confirm Your Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={formik.handleSubmit}
          noValidate
          className={Styles.customForm}
          id="orderForm"
        >
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Your Name"
              name="name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              isInvalid={formik.touched.name && !!formik.errors.name}
              isValid={formik.touched.name && !formik.errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.name}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter Your Email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              autoComplete="username"
              isInvalid={formik.touched.email && !!formik.errors.email}
              isValid={formik.touched.email && !formik.errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.email}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formCity">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Your City"
              name="city"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.city}
              isInvalid={formik.touched.city && !!formik.errors.city}
              isValid={formik.touched.city && !formik.errors.city}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.city}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formAddress">
            <Form.Label>Delivery Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Your Address"
              name="address"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.address}
              isInvalid={formik.touched.address && !!formik.errors.address}
              isValid={formik.touched.address && !formik.errors.address}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.address}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formPhoneNumber">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Your Phone Number"
              name="phoneNumber"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.phoneNumber}
              isInvalid={
                formik.touched.phoneNumber && !!formik.errors.phoneNumber
              }
              isValid={formik.touched.phoneNumber && !formik.errors.phoneNumber}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.phoneNumber}
            </Form.Control.Feedback>
          </Form.Group>
          <Button variant="primary" type="submit" size="lg" block>
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default OrderModal;
