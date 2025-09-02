import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../app/layout";
import { Provider } from "react-redux";
import { store } from "@/app/redux/store";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import Head from "next/head";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
   const router = useRouter();

  // Map routes to titles
  const routeTitles: Record<string, string> = {
    "/": "E-commerce",
    "/place-order": "Orders",
    "/products": "Products",
    "/place-order/add-new": "Create Order",
    "/delivery-report": "Delivery Report",
    "/support-tickets": "Tickets",
    "/category": "Categorys",
    "/customers": "Customers",
    "/orders": "Orders",
    "/coupons": "Coupons",
    "/our-staff": "Our Staff",
    "/setting": "Setting",
  };

    // Default if route not in map
const pageTitle = `Poron || ${routeTitles[router.pathname] || "Loading"}`;

  return (
    <Provider store={store}>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="Order your favorite products easily" />
        {/* OG — স্ট্যাটিক পেজ হলে সরাসরি এখানে */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Poron" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content="Order your favorite products easily" />
        <meta property="og:url" content="https://poron.netlify.app//" />
        <meta property="og:image" content="https://poron.netlify.app/login-dark.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://poron.netlify.app/login-dark.png" />
      </Head>
      <MantineProvider withNormalizeCSS withGlobalStyles>
        <Layout>
          <Notifications position="top-right" autoClose={2000} />
          <Component {...pageProps} />
        </Layout>
      </MantineProvider>
    </Provider>
  );
}
