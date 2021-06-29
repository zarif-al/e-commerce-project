import { providers, signIn } from "next-auth/client";
import { csrfToken } from "next-auth/client";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebookSquare } from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope,
  faArrowCircleLeft,
} from "@fortawesome/free-solid-svg-icons";
import NavBar from "../../components/nav/Nav";
import Form from "react-bootstrap/Form";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import Spinner from "react-bootstrap/Spinner";
import { useState } from "react";
export default function SignIn({ providers, csrfToken }) {
  //use formik put email and csrf token in post body to action address
  const [disable, setDisable] = useState(false);
  const router = useRouter();
  const [message, setMessage] = useState("No Error");
  const [msgColor, setMsgColor] = useState("lightgray");
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
    }),
    enableReinitialize: true,
    onSubmit: async (values) => {
      setDisable(true);
      const resp = await fetch("/api/auth/signin/email", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: values.email, csrfToken: csrfToken }),
      });
      router.push(resp.url);
    },
  });

  if (router.query.error !== undefined && message === "No Error") {
    if (router.query.error === "OAuthAccountNotLinked") {
      setMsgColor("red");
      setMessage(
        "This Email is registered under a different provider. Please select the provider you used the first time."
      );
    } else {
      setMsgColor("blue");
      setMessage("Please Try Another Signin Method");
    }
  }

  return (
    <Container fluid style={{ padding: "0" }}>
      <NavBar screen="signUp" />
      <Container>
        <Row style={{ height: "90vh" }} className="align-items-center">
          <Container
            style={{
              border: "1px solid black",
              maxWidth: "600px",
              borderRadius: "15px",
              backgroundColor: "lightgray",
            }}
          >
            <Row
              style={{
                color: msgColor,
                marginTop: "0.5rem",
              }}
            >
              <Col className="text-center">
                <strong>{message}</strong>
              </Col>
            </Row>
            <Row
              className="justify-content-center"
              style={{ marginTop: "1rem" }}
            >
              <Col xs={11}>
                <Form onSubmit={formik.handleSubmit} noValidate>
                  <Form.Group>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter Your Email"
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
                  <Button
                    variant="light"
                    type="submit"
                    block
                    disabled={disable}
                  >
                    {disable ? (
                      <>
                        <Spinner animation="border" size="sm" /> Redirecting
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon
                          icon={faEnvelope}
                          color="black"
                          size="lg"
                        />{" "}
                        Sign In with Email
                      </>
                    )}
                  </Button>
                </Form>
              </Col>
            </Row>
            {Object.values(providers).map((provider) =>
              provider.name != "Email" ? (
                <Row
                  key={provider.name}
                  className="justify-content-center"
                  style={{ marginBottom: "1rem" }}
                >
                  <Col xs={11}>
                    <Button
                      variant="light"
                      onClick={() =>
                        signIn(provider.id, {
                          callbackUrl: router.query.callbackUrl,
                        })
                      }
                      block
                      disabled={disable}
                    >
                      <FontAwesomeIcon
                        icon={
                          provider.name === "Google"
                            ? faGoogle
                            : faFacebookSquare
                        }
                        color="black"
                        size="lg"
                      />{" "}
                      Sign In with {provider.name}
                    </Button>
                  </Col>
                </Row>
              ) : (
                <Row
                  className="align-items-center"
                  style={{ margin: "1.5rem" }}
                >
                  <Col>
                    <hr style={{ borderTop: "1px solid black" }} />
                  </Col>
                  <Col className="text-center" xs={2}>
                    <strong>OR</strong>
                  </Col>
                  <Col>
                    <hr style={{ borderTop: "1px solid black" }} />
                  </Col>
                </Row>
              )
            )}
            <Row
              key="returnButton"
              className="justify-content-center"
              style={{ marginBottom: "2.5rem" }}
            >
              <Col xs={11}>
                <Button
                  variant="light"
                  onClick={() => {
                    router.push("/");
                  }}
                  block
                  disabled={disable}
                >
                  <FontAwesomeIcon
                    icon={faArrowCircleLeft}
                    color="black"
                    size="lg"
                  />{" "}
                  Return to Shop
                </Button>
              </Col>
            </Row>
          </Container>
        </Row>
      </Container>
      <Container
        fluid
        style={{
          position: "absolute",
          bottom: "0",
          backgroundColor: "black",
        }}
      >
        <Row>
          <Col className="text-center" style={{ color: "white" }}>
            © Copyright 2015 Ecommerce Demo. All rights reserved.
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

SignIn.getInitialProps = async (context) => {
  return {
    providers: await providers(context),
    csrfToken: await csrfToken(context),
  };
};
