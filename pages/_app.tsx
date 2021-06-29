import Head from "next/head";
import NavBar from "../components/nav/Nav";
import SubNav from "../components/nav/SubNav";
import Footer from "../components/Footer";
import SideNav from "../components/nav/components/SideNav";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { Provider } from "next-auth/client";
import { config } from "@fortawesome/fontawesome-svg-core";
import { useEffect, useState } from "react";
config.autoAddCss = false;

function MyApp({ Component, pageProps }) {
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
  const [Categories, setCategories] = useState(null);
  useEffect(() => {
    fetch("/api/categories")
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      });
  }, []);

  return (
    <Provider session={pageProps.session}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Head>
          <title>E-Commerce App</title>
        </Head>
        <NavBar screen="home" showSidebar={showSidebar} />
        <SubNav categories={Categories} />
        <SideNav
          categories={Categories}
          sidebar={sidebar}
          showSidebar={showSidebar}
        />
        <Component {...pageProps} />
        <Footer />
      </div>
    </Provider>
  );
}

export default MyApp;
