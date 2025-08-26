import React, { useEffect, useState } from "react";
import OrderDetailsForm from "./OrderDetailsForm";
import * as Yup from "yup";
import { AppForm, FormBtn } from "../../shared/Form";
import FormHeader from "../../shared/FormHeader";
import { db, timestamp } from "@/app/utils/firebase";
import Button from "../../shared/Button";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/app/redux/slices/authSlice";
import { Today } from "@/admin/utils/helpers";
import { selectConfig } from "@/app/redux/slices/configSlice";
import axios from "axios";
import {
  selectSingleCustomer,
  updateSingleCustomer,
} from "@/app/redux/slices/singleCustomerSlice";
import { selectProduct } from "@/app/redux/slices/productSlice";
import { notifications } from "@mantine/notifications";
import firebase from "firebase";

const validationSchema = Yup.object().shape({
  delivery_type: Yup.boolean().required().label("Delivery type"),
  phone_number: Yup.string()
    .matches(/^[0-9]{11}$/, "Must be exactly 11 digits")
    .required()
    .label("Phone number"),
  customer_name: Yup.string().max(50).required().label("Name"),
  received_by: Yup.string().max(60).required().label("Admin"),
  markAs: Yup.string().max(60).required().label("Normal"),
  order_from: Yup.string().max(60).required().default("Messenger Order"),
  customer_address: Yup.string().max(300).required().label("Address"),
  ad_ID: Yup.string().max(5).label("Ad ID"),
  salePrice: Yup.number().required().label("Sale Price"),
  note: Yup.string().max(400).label("Note"),
  invoice_Note: Yup.string().max(400).label("Invoice Note"),
});

const AddOrder = ({ onClick }) => {
  const [config, setConfig] = useState(useSelector(selectConfig) || null);
  const [loading, setLoading] = useState(false);
  const [orderResponse, setOrderResponse] = useState(false);
  const user = useSelector(selectUser);
  const router = useRouter();
  const [products, setProducts] = useState(null);
  const [uid, setInvoiceID] = useState(null);

  const getCustomer = useSelector(selectSingleCustomer);
  const p = useSelector(selectProduct);
  const dispatch = useDispatch();

  useEffect(() => {
    const temp = [];
    const item = p?.map((i) => temp.push(i?.product_details));
    setProducts(temp);
  }, []);

  // Get OrderID from firebase database
  useEffect(() => {
    const unSub = db.collection("orderID").onSnapshot((snap) => {
      snap.docs.map((doc) => {
        setInvoiceID(doc.data());
      });
    });

    return () => {
      unSub();
    };
  }, []);

  const placeOrder = async (values) => {
    setLoading(true);
    const order = [];
    let totalPrice = 0;
    let weight = 0;

    products &&
      products.map((item) => {
        const yup = item.yup;

        if (values[yup]) {
          const title = item.yup.split("_");
          let s = [];

          title &&
            title.map((e) => {
              s.push(e[0].toUpperCase() + e.slice(1));
            });

          weight += values[yup];

          if (item?.product_type === "আম") {
            order.push({
              title: s.join(" "),
              quantity: values[yup] * 12,
              lot: values[yup],
              sku: item?.sku,
              price: item.sale_price,
              total_price: values[yup] * 12 * item.sale_price,
              type: "mango",
            });
          } else {
            order.push({
              title: s.join(" "),
              quantity: values[yup],
              price: item.sale_price,
              total_price: values[yup] * item.sale_price,
            });
          }
        }
      });

    order &&
      order.map((p) => {
        totalPrice += p.total_price;
      });

    const deliveryCrg =
      weight >= 1 && weight === 1 ? 130 : 130 + (weight - 1) * 20;
    const discount =
      totalPrice + deliveryCrg - values.salePrice > 0
        ? totalPrice + deliveryCrg - values?.salePrice
        : "0";

    const date = Today();

    const counterRef = db.collection("counters").doc("orderCounter");

    console.log(values, order);

    db.runTransaction(async (transaction) => {
      const counterDoc = await transaction.get(counterRef);

      // If the document doesn’t exist, set it up with an initial value
      if (!counterDoc.exists) {
        transaction.set(counterRef, { value: 1 }); // Initialize with 1
        return 1;
      } else {
        // Increment the existing value by 1
        transaction.update(counterRef, {
          value: firebase.firestore.FieldValue.increment(1),
        });
        return counterDoc.data().value + 1; // Return new value after increment
      }
    })
      .then((newOrderId) => {
        const orderID = `RA0${newOrderId}`;
        const cusetomer_id = `RAC0${newOrderId}`;
        // Set your API key and secret key
        const apiKey = config[0]?.values.sfc_api_key;
        const secretKey = config[0]?.values.sfc_secret_key;

        // Prepare headers for the request
        const headers = new Headers();
        headers.append("Api-Key", apiKey);
        headers.append("Secret-Key", secretKey);
        headers.append("Content-Type", "application/json");

        const orderData = {
          cod_amount: `${values.salePrice}`,
          invoice: `${orderID}`,
          note: `${values.note}`,
          recipient_address: `${
            values?.delivery_type ? "(HOME Delivery), " : "(POINT Delivery), "
          }${values.customer_address}`,
          recipient_name: `${values.customer_name}`,
          recipient_phone: `${values.phone_number}`,
        };

        try {
          const response = fetch(
            "https://portal.steadfast.com.bd/api/v1/create_order",
            {
              method: "POST",
              headers: headers,
              body: JSON.stringify(orderData),
            }
          )
            .then((response) => response.json()) // Resolve JSON data
            .then((data) => {
              console.log(data);
              notifications.show({
                title: data?.message || "Something went Wrong",
                message: `"Status:" ${data?.status}`,
                color: "blue",
              });
              const tracking_code = data?.consignment?.tracking_code;
              const sfc = {
                consignment_id: data?.consignment?.consignment_id || null,
                tracking_code: data?.consignment?.tracking_code || null,
              };
              dispatch(updateSingleCustomer(null));
              sendConfirmationMsg(values, orderID, tracking_code);
              createCustomer(values, date, cusetomer_id);
              const orderData = {
                sfc,
                deliveryCrg,
                weight,
                customer_details: values,
                discount,
                totalPrice,
                date,
                order,
                timestamp,
                placeBy: user.name,
                placeById: user.staff_id,
                status: "Pending",
                orderID,
              };
              // console.log(orderData);
              try {
                db.collection("placeOrder").doc(orderID).set(orderData);
              } catch (error) {
                notifications.show({
                  title: "Failed to place order",
                  message: `Please try again later..`,
                  color: "orange",
                });
                // setLoading(false);
                setOrderResponse(null);
                console.error("Error placing order:", error);
              } finally {
                dispatch(updateSingleCustomer(null));
                router.push("/place-order/id=" + orderID);
              }
            });
        } catch (error) {
          notifications.show({
            title: "Something went wrong!!!",
            message: `Please try again later..`,
            color: "orange",
          });
          // setLoading(false);
          dispatch(updateSingleCustomer(null));
          setOrderResponse(null);
          console.log("Error SFC entry: ", error);
        }
      })
      .catch((error) => {
        notifications.show({
          title: "Something went wrong!!!",
          message: `Please try again later..`,
          color: "orange",
        });
        setOrderResponse(null);
        // setLoading(false);
        console.error("Transaction failed:", error);
      });
    // setLoading(false);
  };

  // place product handler on submit
  // const placeOrder = async (values) => {
  //   setLoading(true);
  //   const invoice_id = Number(uid?.invoice_id) + 1;
  //   const invoice_str = `RA0${invoice_id}`;
  //   const cusetomer_id = `RAC0${invoice_id}`;
  //   await updateInvoiceID(invoice_id);

  //   const order = [];
  //   let totalPrice = 0;
  //   let weight = 0;

  //   products &&
  //     products.map((item) => {
  //       console.log(item?.product_type === "আম");

  //       const yup = item.yup;

  //       if (values[yup]) {
  //         const title = item.yup.split("_");
  //         let s = [];

  //         title &&
  //           title.map((e) => {
  //             s.push(e[0].toUpperCase() + e.slice(1));
  //           });

  //         weight += values[yup];

  //         if (item?.product_type === "আম") {
  //           order.push({
  //             title: s.join(" "),
  //             quantity: values[yup] * 12,
  //             lot: values[yup],
  //             price: item.sale_price,
  //             total_price: values[yup] * 12 * item.sale_price,
  //           });
  //         } else {
  //           order.push({
  //             title: s.join(" "),
  //             quantity: values[yup],
  //             price: item.sale_price,
  //             total_price: values[yup] * item.sale_price,
  //           });
  //         }
  //       }
  //     });

  //   order &&
  //     order.map((p) => {
  //       totalPrice += p.total_price;
  //     });

  //   const deliveryCrg =
  //     weight >= 1 && weight === 1 ? 130 : 130 + (weight - 1) * 20;
  //   const discount =
  //     totalPrice + deliveryCrg - values.salePrice > 0
  //       ? totalPrice + deliveryCrg - values?.salePrice
  //       : "0";

  //   const date = Today();

  //   try {
  //     // Set your API key and secret key
  //     const apiKey = config[0]?.values.sfc_api_key;
  //     const secretKey = config[0]?.values.sfc_secret_key;

  //     // Prepare headers for the request
  //     const headers = new Headers();
  //     headers.append("Api-Key", apiKey);
  //     headers.append("Secret-Key", secretKey);
  //     headers.append("Content-Type", "application/json");

  //     const orderData = {
  //       cod_amount: `${values.salePrice}`,
  //       invoice: `${invoice_str}`,
  //       note: `${values.note}`,
  //       recipient_address: `${
  //         values?.delivery_type ? "HOME Delivery, " : "POINT Delivery, "
  //       }${values.customer_address}`,
  //       recipient_name: `${values.customer_name}`,
  //       recipient_phone: `${values.phone_number}`,
  //     };
  //     const response = fetch(
  //       "https://portal.steadfast.com.bd/api/v1/create_order",
  //       {
  //         method: "POST",
  //         headers: headers,
  //         body: JSON.stringify(orderData),
  //       }
  //     );

  //     // // Handle the response
  //     await placeOrderHandler(
  //       deliveryCrg,
  //       weight,
  //       values,
  //       discount,
  //       totalPrice,
  //       date,
  //       order,
  //       invoice_str,
  //       timestamp
  //     );
  //     await sendConfirmationMsg(values, invoice_str);
  //   } catch (error) {
  //     await isFailedPlaceOrderHandler(
  //       deliveryCrg,
  //       weight,
  //       values,
  //       discount,
  //       totalPrice,
  //       date,
  //       order,
  //       invoice_str,
  //       timestamp
  //     );
  //     await sendConfirmationMsg(values, invoice_str);

  //     console.error("Error placing order:", error);
  //   }

  //   await createCustomer(values, date, cusetomer_id, timestamp);

  //   router.push("/place-order/id=" + invoice_str);
  //   setOrderResponse(null);
  // };

  const sendConfirmationMsg = async (values, orderID, tracking_code = "") => {
    const customer_name = values?.customer_name || "Customer";
    const company_name = config[0]?.values.company_name;
    const company_contact = config[0]?.values.company_contact;

    const url = "https://api.sms.net.bd/sendsms";
    const apiKey = config[0]?.values.bulk_auth;
    const message = `Dear ${customer_name}, Your order has been successfully placed at ${company_name}. Invoice No: ${orderID}. Please keep BDT: ${
      values?.salePrice
    }tk ready while receiving the parcel.${
      tracking_code &&
      ` Track your Parcel here: https://steadfast.com.bd/t/${tracking_code}`
    } Hotline: +88${company_contact}. Thanks for being with us.`;
    const to = values?.phone_number;

    const formData = new FormData();
    formData.append("api_key", apiKey);
    formData.append("msg", message);
    formData.append("to", to);

    axios
      .post(url, formData)
      .then((response) => {
        console.log(response.data);
        notifications.show({
          title: response?.data.msg,
          message: "Message sent successfully",
          color: "blue",
        });
      })
      .catch((error) => {
        throw new Error(error);
      });
  };
  // create Customer on firebase database
  const createCustomer = async (values, cusetomer_id, timestamp) => {
    await db.collection("createCustomer").doc(values?.phone_number).set({
      cus_name: values.customer_name,
      cus_contact: values.phone_number,
      cus_address: values.customer_address,
      cusetomer_id,
      timestamp,
    });
  };

  return (
    <main>
      <div>
        <AppForm
          initialValues={{
            delivery_type: true || "",
            phone_number: "",
            customer_name: "",
            customer_address: "",
            salePrice: "",
            received_by: "Admin",
            order_from: "Messenger Order",
            markAs: "Normal",
            ad_ID: "",
            invoice_Note: "",
            note: "",
          }}
          onSubmit={placeOrder}
          validationSchema={validationSchema}
        >
          <div className="h-screen relative">
            <div className="w-full">
              <FormHeader
                onClick={onClick}
                title={"Place Order"}
                sub_title="Add your product and necessary information from here."
              />
            </div>

            <div className="w-full h-[75%] md:h-[80%] overflow-y-scroll py-3 px-6 md:px-4 mb-4">
              <OrderDetailsForm />
            </div>

            <div className="fixed bottom-0 right-0 w-full bg-gray-50">
              <div className="py-5 px-6 md:px-4 max-h-full grid grid-cols-4 gap-4">
                <div className="col-span-2">
                  <Button
                    onClick={onClick}
                    title="Cancel"
                    className="bg-red-100 hover:bg-red-200 hover:shadow-lg text-red-600 transition-all duration-300 w-full"
                  />
                </div>
                <div className="col-span-2">
                  <FormBtn
                    disabled={loading}
                    loading={loading}
                    onClick={placeOrder}
                    title="Submit"
                    className="bg-blue-400 hover:bg-blue-500 hover:shadow-lg text-white transition-all duration-300 w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </AppForm>
      </div>
    </main>
  );
};

export default AddOrder;
