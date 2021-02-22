import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { Provider } from "next-auth/client";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} />;
    </Provider>
  );
}

export default MyApp;
