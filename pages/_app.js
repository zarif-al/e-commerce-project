import Head from "next/head";
import NavBar from "../components/nav/Nav";
import SubNav from "../components/nav/SubNav";
import Footer from "../components/layout/Footer";
import SideNav from "../components/nav/components/SideNav";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { Provider } from "next-auth/client";
import { config } from "@fortawesome/fontawesome-svg-core";
import { useEffect, useState } from "react";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
config.autoAddCss = false;

function MyApp({ Component, pageProps }) {
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
  const handleOverlay = () => setOverlay(!overlay);
  const [Categories, setCategories] = useState(null);
  const [overlay, setOverlay] = useState(false);
  //Disable body scroll when overlay is active
  if (process.browser) {
    overlay ? disableBodyScroll(document) : enableBodyScroll(document);
  }

  useEffect(() => {
    fetch("/api/categories")
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      });
  }, []);

  return (
    <Provider session={pageProps.session}>
      <div style={{ display: "flex", flexDirection: "column" }} id="mainDiv">
        <Head>
          <title>E-Commerce App</title>
        </Head>
        <NavBar
          screen="home"
          showSidebar={showSidebar}
          handleOverlay={handleOverlay}
        />
        <SubNav categories={Categories} />
        <SideNav
          categories={Categories}
          sidebar={sidebar}
          showSidebar={showSidebar}
          handleOverlay={handleOverlay}
        />
        <Component {...pageProps} handleOverlay={handleOverlay} />
        <Footer />
      </div>
    </Provider>
  );
}

export default MyApp;
