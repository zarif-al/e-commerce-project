import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";
import Head from "next/head";
import NavBar from "../components/nav/Nav";
import SubNav from "../components/nav/SubNav";
import Footer from "../components/layout/Footer";
import SideNav from "../components/nav/components/SideNav";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { Provider } from "next-auth/client";
import { config } from "@fortawesome/fontawesome-svg-core";
import { useEffect, useState } from "react";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { Container } from "react-bootstrap";
import Swal from "sweetalert2";
config.autoAddCss = false;

function MyApp({ Component, pageProps }) {
  //To prevent body scroll when using side bars
  const handleOverlay = () => setOverlay(!overlay);
  //for sidenav and subnav
  const [Categories, setCategories] = useState(null);
  //overlay state
  const [overlay, setOverlay] = useState(false);
  //Disable body scroll when overlay is active
  if (process.browser) {
    overlay ? disableBodyScroll(document) : enableBodyScroll(document);
  }
  //Fire Swal
  const fireSwal = () => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Added To Cart!",
      showConfirmButton: false,
      showCloseButton: true,
      timer: 3500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
  };

  /*   useEffect(() => {
    fetch("/api/categories")
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      });
  }, []); */

  return (
    <Provider session={pageProps.session}>
      <Head>
        <title>E-Commerce App</title>
      </Head>
      <Container fluid style={{ padding: "0" }}>
        <NavBar handleOverlay={handleOverlay} categories={Categories} />
        <SubNav categories={Categories} />
        <Component
          {...pageProps}
          handleOverlay={handleOverlay}
          fireSwal={fireSwal}
          setCategories={setCategories}
        />
        <Footer />
      </Container>
    </Provider>
  );
}

export default MyApp;
