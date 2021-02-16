import Container from "react-bootstrap/Container";
import NavBar from "../components/Nav";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import Styles from "../styles/SignUpStyle.module.css";
import SignUpModal from "../components/SignUpModal";
import { useState } from "react";
import { useRouter } from "next/router";
function signIn() {
  const router = useRouter();
  const [modalShow, setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState({
    type: "",
    code: 0,
  });

  const postData = async (formData) => {
    try {
      const res = await fetch("/api/signUpApi", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        if (res.status === 600) {
          const result: any = await res.json();
          if (result.response.code === 11000) {
            formik.setErrors({
              email: "Email Address Already Exists",
            });
          } else {
            setModalMessage({ type: "dbError", code: result.response.code });
            setModalShow(true);
            //Modal DB Error
          }
        } else {
          setModalMessage({ type: "otherError", code: res.status });
          setModalShow(true);
          //Modal OTHER Error
        }
      } else {
        setModalMessage({ type: "success", code: 0 });
        setModalShow(true);
        setTimeout(function () {
          router.push("/");
        }, 2000);
      }
    } catch (error) {
      setModalMessage({ type: "appError", code: error });
      setModalShow(true);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      c_password: "",
      city: "",
      address: "",
      phoneNumber: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().required("Required"),
      c_password: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Required"),
      city: Yup.string().required("Required"),
      address: Yup.string().required("Required"),
      phoneNumber: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      const data = {
        name: values.name,
        email: values.email,
        password: values.password,
        city: values.city,
        address: values.address,
        phoneNumber: values.phoneNumber,
      };
      postData(data);
    },
  });

  return (
    <>
      <Container fluid style={{ padding: "0" }}>
        <NavBar screen="signUp" modalShow={"none"} />
        <Container>
          <Form
            onSubmit={formik.handleSubmit}
            noValidate
            className={Styles.customForm}
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
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.email}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                isInvalid={formik.touched.password && !!formik.errors.password}
                autoComplete="new-password"
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.password}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                name="c_password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.c_password}
                autoComplete="new-password"
                isInvalid={
                  formik.touched.c_password && !!formik.errors.c_password
                }
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.c_password}
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
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.city}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Your Address"
                name="address"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.address}
                isInvalid={formik.touched.address && !!formik.errors.address}
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
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.phoneNumber}
              </Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" type="submit" size="lg" block>
              Submit
            </Button>
          </Form>
          <SignUpModal
            show={modalShow}
            onHide={() => setModalShow(false)}
            modalMessage={modalMessage}
          />
        </Container>
      </Container>
    </>
  );
}

export default signIn;
