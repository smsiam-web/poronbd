import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { notifications } from "@mantine/notifications";

import { AppForm, FormBtn } from "../../shared/Form";
import FormHeader from "../../shared/FormHeader";
import Button from "../../shared/Button";

import { db } from "@/app/utils/firebase"; // timestamp not needed; we’ll use new Date().toISOString()
import { selectUser } from "@/app/redux/slices/authSlice";
import { selectConfig } from "@/app/redux/slices/configSlice";
import {
  selectSingleCustomer,
  updateSingleCustomer,
} from "@/app/redux/slices/singleCustomerSlice";
import firebase from "firebase";
import OrderDetailsFormUp from "./OrderDetails";
import { orderValidationSchemaCOD } from "@/lib/validationSchema";

// Helper to uppercase currency and normalize method casing, etc.
const normalizeOrder = (values) => {
  const now = new Date().toISOString();

  const v = { ...values };

  // Ensure required top-level timestamps exist
  v.created_at = v.created_at || now;
  v.updated_at = now;

  // Normalize currency (top-level + items)
  v.currency = (v.currency || "BDT").toUpperCase();
  v.items = (v.items || []).map((it) => ({
    ...it,
    currency: (it.currency || v.currency || "BDT").toUpperCase(),
    // Keep line_total consistent; UI already auto-computes it,
    // but recompute just in case:
    line_total:
      typeof it.line_total === "number"
        ? it.line_total
        : Number(it.price || 0) * Number(it.quantity || 0),
  }));

  // Payment/fulfillment normalizations
  v.payment = {
    method: (v.payment?.method || "cod").toLowerCase(),
    status: v.payment?.status || "unpaid",
    transaction_id: v.payment?.transaction_id || null,
  };

  v.fulfillment = {
    status: v.fulfillment?.status || "unfulfilled",
    courier: v.fulfillment?.courier || "Pathao",
    tracking_numbers: v.fulfillment?.tracking_numbers || [],
  };

  // Totals: keep items sum and grand consistent
  const itemsSum = v.items.reduce(
    (s, it) => s + Number(it.line_total || 0),
    0
  );
  const discount = Number(v?.totals?.discount || 0);
  const shipping = Number(v?.totals?.shipping || 0);
  const grand = +(itemsSum - discount + shipping ).toFixed(2);

  v.totals = {
    items: +itemsSum.toFixed(2),
    discount: +discount.toFixed(2),
    shipping: +shipping.toFixed(2),
    grand,
  };

  // Default meta/source
  v.meta = { source: v?.meta?.source || "web" };

  return v;
};

const AddOrder = ({ onClick }) => {
  const [loading, setLoading] = useState(false);
  const [config] = useState(useSelector(selectConfig) || null);

  const user = useSelector(selectUser);
  const router = useRouter();
  const dispatch = useDispatch();

  const getCustomer = useSelector(selectSingleCustomer);

  // Submit handler
    const placeOrder = async (values) => {
     console.log("p3", values);
           // Normalize & validate with Yup
       const normalized = normalizeOrder(values);
       await orderValidationSchemaCOD.validate(normalized, {
         abortEarly: false,
       });
        console.log( normalized);
     const counterRef = db.collection("counters").doc("JFOrderCounter");
 
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
       .then(async (newOrderId) => {
         const orderID = `PR0${newOrderId}`;
         const customer_id = `PRC0${newOrderId}`;
 
         const orderPayload = {
           store_id: `${normalized?.items[0]?.store_id}`,
           merchant_order_id: `${orderID}`,
           recipient_name: `${normalized?.customer?.name}`,
           recipient_phone: `${normalized?.customer?.phone}`,
           recipient_address: `${normalized?.shipping_address?.street}`,
           // recipient_city: 1,
           // recipient_zone: 10,
           // recipient_area: 101,
           delivery_type: 48,
           item_type: 2,
           special_instruction: `${normalized?.notes}`,
           item_quantity: 1,
           item_weight: "1",
           item_description: "",
           amount_to_collect: `${normalized?.totals?.grand}`,
         };
 
         try {
    
           const response = await fetch("/api/pathao/place-order", {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify(orderPayload),
           });
           const result = await response.json();
           const orderData = {
             normalized,
             orderID,
           };
           // console.log(orderData);
           try {
              await db.collection("orders").doc(orderID).set(normalized);
             // order ডক পড়ুন যাতে timestamp মিলে যায়
            
              updateCounters(orderData);
      
           } catch (error) {
             notifications.show({
               title: "Failed to place order",
               message: `Please try again later..`,
               color: "orange",
               autoClose: 5000,
             });
 
             setOrderResponse(null);
             console.error("Error placing order:", error);
           } finally {
             // setOrderResponse(null);
             // dispatch(updateSingleCustomer(null));
             router.push("/place-order/id=" + orderID);
             // createCustomer(values, customer_id, timestamp);
           // sendConfirmationMsg(values, customer_id, timestamp);
 
           }
 
           if (!response.ok) {
             const errorText = await response.text();
             throw new Error(`Server error: ${errorText}`);
           }
           if (result.type === "success" && result.code === 200) {
             notifications.show({
               title: "Success",
               message: `Order placed successfully. Consignment ID: ${result.data.consignment_id}`,
               color: "blue",
               autoClose: 7000,
             });
           } else {
             notifications.show({
               title: "Error",
               message: result.message || "Failed to place order.",
               color: "red",
               autoClose: 7000,
             });
           }
         } catch (error) {
           console.error("Transaction failed:", error);
         }
       })
       .catch((error) => {
         notifications.show({
           title: "Something went wrong!!!",
           message: `Please try again later..`,
           color: "orange",
           autoClose: 7000,
         });
         // setOrderResponse(null);
         setLoading(false);
         console.error("Transaction failed:", error);
       });
   };

  return (
    <main>
      <div>
        <AppForm
          initialValues={{
            // --- Basics ---
            id: "",
            status: "pending",
            currency: "BDT",
            store_id: "",

            // --- Customer ---
            customer: {
              name: "",
              phone: "",
            },

            // --- Addresses ---
            shipping_address: {      
              street: "",
              city: "",
              state: "",
              country: "BD",
            },

            // --- Payment & Fulfillment ---
            payment: {
              method: "cod",
              status: "unpaid",
              transaction_id: "",
            },
            fulfillment: {
              status: "unfulfilled",
              carrier: "",
              tracking_numbers: [],
            },

            // --- Items & Discounts ---
            items: [],
            discounts: [],

            // --- Totals (items auto-calculated in the form) ---
            totals: {
              items: 0,
              discount: 0,
              shipping: 0,          
              grand: 0,
            },

            // --- Meta & notes ---
            meta: { source: "web" },
            notes: "",
          }}
          validationSchema={orderValidationSchemaCOD}
          onSubmit={placeOrder}
        >
          <div className="h-screen relative">
            {/* Header */}
            <div className="w-full">
              <FormHeader
                onClick={onClick}
                title="Place Order"
                sub_title="Add items and customer details, then submit."
              />
            </div>

            {/* Scrollable content */}
            <div className="w-full h-[75%] md:h-[80%] overflow-y-scroll py-3 px-6 md:px-4 mb-4">
              <OrderDetailsFormUp />
            </div>

            {/* Footer actions */}
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
                  {/* Submit the form */}
                  <FormBtn
                    disabled={loading}
                    loading={loading}
                    type="submit"
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
