import { getProviders, signIn } from "next-auth/client";
import { getCsrfToken } from "next-auth/client";
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
import Form from "react-bootstrap/Form";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import Spinner from "react-bootstrap/Spinner";
import { useState } from "react";
import ErrorModal from "../../components/auth/components/ErrorModal";
import styles from "../../styles/authentication/SignIn.module.css";
export default function SignIn({ providers, csrfToken }) {
  //use formik put email and csrf token in post body to action address
  const [disable, setDisable] = useState(false);
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("No Error");
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
        body: JSON.stringify({
          email: values.email,
          csrfToken: csrfToken,
        }),
      });
      router.push(resp.url);
    },
  });

  if (router.query.error !== undefined && message === "No Error") {
    if (router.query.error === "OAuthAccountNotLinked") {
      setMessage(
        "This Email is registered under a different provider (Google,Facebook). Please select the provider you used the first time."
      );
    } else if (router.query.error === "OAuthSignin") {
      setMessage("Error in constructing an authorization URL");
    } else if (router.query.error === "OAuthCallback") {
      setMessage(" Error in handling the response from an OAuth provider.");
    } else if (router.query.error === "OAuthCreateAccount") {
      setMessage("Could not create OAuth provider user in the database.");
    } else if (router.query.error === "EmailCreateAccount") {
      setMessage("Could not create email provider user in the database.");
    } else if (router.query.error === "EmailSignin") {
      setMessage(" Sending the e-mail with the verification token failed.");
    } else if (router.query.error === "CredentialsSignin") {
      setMessage("Account/Password mismatch.");
    } else {
      setMessage("Please Try Another Signin Method");
    }
    setShowModal(true);
  }

  return (
    <Container className={styles.mainContainer}>
      <Row className={styles.signInRow}>
        <Col className={styles.emailSignInCol} xs={12} sm={12} md={6}>
          <div className={styles.emailSignIn}>
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
                variant="outline-primary"
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
                    <Row noGutters={true} className={styles.buttonRow}>
                      <Col xs={3} sm={2} md={2} lg={2}>
                        <FontAwesomeIcon icon={faEnvelope} size="lg" />
                      </Col>
                      <Col
                        xs={9}
                        sm={7}
                        md={7}
                        lg={5}
                        className={styles.buttonTextCol}
                      >
                        Sign In with Email
                      </Col>
                    </Row>
                  </>
                )}
              </Button>
            </Form>
          </div>
        </Col>
        <Col className={styles.providerSignInCol} xs={12} sm={12} md={6}>
          <div className={styles.providerSignIn}>
            {Object.values(providers).map((provider) =>
              provider.name != "Email" ? (
                <Button
                  variant="outline-primary"
                  onClick={() =>
                    signIn(provider.id, {
                      callbackUrl: router.query.callbackUrl,
                    })
                  }
                  block
                  disabled={disable}
                  className={styles.providerButton}
                  key={provider.name}
                >
                  <Row noGutters={true} className={styles.buttonRow}>
                    <Col xs={3} sm={2} md={2} lg={2}>
                      <FontAwesomeIcon
                        icon={
                          provider.name === "Google"
                            ? faGoogle
                            : faFacebookSquare
                        }
                        size="lg"
                      />
                    </Col>
                    <Col
                      xs={9}
                      sm={7}
                      md={7}
                      lg={5}
                      className={styles.buttonTextCol}
                    >
                      Sign In with {provider.name}
                    </Col>
                  </Row>
                </Button>
              ) : (
                ""
              )
            )}
          </div>
        </Col>
      </Row>
      <ErrorModal
        show={showModal}
        onHide={() => setShowModal(false)}
        message={message}
      />
      {/*   <Row
        style={{
          color: msgColor,
          marginTop: "0.5rem",
        }}
      >
        <Col className="text-center">
          <strong>{message}</strong>
        </Col>
      </Row>
      <Row className="justify-content-center" style={{ marginTop: "1rem" }}>
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
            <Button variant="light" type="submit" block disabled={disable}>
              {disable ? (
                <>
                  <Spinner animation="border" size="sm" /> Redirecting
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faEnvelope} color="black" size="lg" />{" "}
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
                    provider.name === "Google" ? faGoogle : faFacebookSquare
                  }
                  color="black"
                  size="lg"
                />{" "}
                Sign In with {provider.name}
              </Button>
            </Col>
          </Row>
        ) : (
          <Row className="align-items-center" style={{ margin: "1.5rem" }}>
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
            <FontAwesomeIcon icon={faArrowCircleLeft} color="black" size="lg" />{" "}
            Return to Shop
          </Button>
        </Col>
      </Row> */}
    </Container>
  );
}

export async function getServerSideProps(context) {
  const providers = await getProviders();
  const csrfToken = await getCsrfToken(context);
  return {
    props: { providers, csrfToken },
  };
}
