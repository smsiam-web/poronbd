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
  const title = routeTitles[router.pathname];
  return (
    <Provider store={store}>
      <Head>
        <title>Poron || {title ? title : "Loading"}</title>
        <meta name="description" content="Order your favorite products easily" />
        <link rel="icon" href="/favicon.ico?v=2" />
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
