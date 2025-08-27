import React, { useState } from "react";
import { AppForm, FormBtn } from "../../shared/Form";
import FormHeader from "../../shared/FormHeader";
import { db, timestamp } from "@/app/utils/firebase";
import Button from "../../shared/Button";
import { useRouter } from "next/router";
import ProductDetailsFormUp from "./ProductDetailsFormUp";
import { porductInitialValues, productValidationSchema } from "@/lib/validationSchema";
import { notifications } from "@mantine/notifications";

// const validationSchema = Yup.object().shape({
//   id: Yup.number().required(),
//   store_id: Yup.number().optional(),
//   single_sku: Yup.string().required("SKU is required"),
//   title: Yup.string().required("Product title is required"),
//   slug: Yup.string().required("Slug is required"),
//   status: Yup.string().oneOf(["draft", "active", "archived"]).required(),
//   brand: Yup.string().nullable(),
//   description: Yup.string().nullable(),

//   categories: Yup.array().of(
//     Yup.object().shape({
//       id: Yup.string().required(),
//       name: Yup.string().optional(),
//       slug: Yup.string().optional(),
//     })
//   ),

//   options: Yup.array().of(
//     Yup.object().shape({
//       id: Yup.number().optional(),
//       name: Yup.string().required("Option name is required"),
//       values: Yup.array()
//         .of(
//           Yup.object().shape({
//             id: Yup.number().optional(),
//             value: Yup.string().required("Option value is required"),
//             swatch_hex: Yup.string()
//               .matches(/^#([0-9A-F]{3}){1,2}$/i, "Invalid color hex")
//               .nullable(),
//           })
//         )
//         .min(1, "Each option must have at least 1 value"),
//     })
//   ),

//   variants: Yup.array()
//     .of(
//       Yup.object().shape({
//         id: Yup.number().optional(),
//         sku: Yup.string().required("SKU is required"),
//         barcode: Yup.string().nullable(),
//         price: Yup.number().required("Price is required").min(0),
//         compare_at_price: Yup.number().nullable(),
//         compare_at_price: Yup.number().nullable(),
//         currency: Yup.string()
//           .length(3, "Currency must be ISO code")
//           .required(),
//         is_active: Yup.boolean().required(),

//         option_values: Yup.array()
//           .of(
//             Yup.object().shape({
//               option_id: Yup.number().optional(),
//               option_name: Yup.string().optional(),
//               value_id: Yup.number().optional(),
//               value: Yup.string().optional(),
//             })
//           )
//           .min(1, "Variant must have option values"),

//         inventory: Yup.array()
//           .of(
//             Yup.object().shape({
//               location_code: Yup.string().required(),
//               stock_on_hand: Yup.number().min(0).required(),
//               stock_reserved: Yup.number().min(0).default(0),
//               reorder_point: Yup.number().min(0).default(0),
//               allow_backorder: Yup.boolean().default(false),
//             })
//           )
//           .required("Inventory is required"),

//         images: Yup.array()
//           .of(
//             Yup.object().shape({
//               id: Yup.number().optional(),
//               url: Yup.string().url().required(),
//               alt_text: Yup.string().nullable(),
//               position: Yup.number().required(),
//             })
//           )
//           .optional(),

//         weight_grams: Yup.number().min(0).nullable(),
//         dimensions_cm: Yup.object()
//           .shape({
//             length: Yup.number().nullable(),
//             width: Yup.number().nullable(),
//             height: Yup.number().nullable(),
//           })
//           .nullable(),
//       })
//     )
//     .min(1, "At least one variant is required"),

//   attributes: Yup.object().nullable(),

//   seo: Yup.object().shape({
//     title: Yup.string().max(255).nullable(),
//     description: Yup.string().max(300).nullable(),
//   }),
// });

const AddProduts = ({ onClick }) => {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const router = useRouter();

  const product_details = product && product[0]?.product_details;


  // save product to Firestore
const placeProductHandler = async (values) => {
  setLoading(true);

  try {
    const col = db.collection("products");
    let docId = values?.id ? String(values.id) : null;

    if (!docId) {
      // create a new doc id if none provided
      const ref = col.doc();
      docId = ref.id;
      await ref.set({ ...values, id: docId, timestamp }, { merge: true });
    } else {
      await col.doc(docId).set({ ...values, timestamp }, { merge: true });
    }

    notifications.show({
      title: "Success",
      message: "Product updated successfully",
      color: "green",
      autoClose: 2500,
    });

    // navigate after successful write
    router.push(`/products/id=?${docId}`);
  } catch (err) {
    console.error("placeProductHandler error:", err);
    notifications.show({
      title: "Update failed",
      message: err?.message || "Something went wrong while saving the product.",
      color: "red",
      autoClose: 4000,
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <main>
      <div>
        <AppForm
          initialValues={porductInitialValues(product_details)}
          onSubmit={placeProductHandler}
          validationSchema={productValidationSchema}
        >
          <div className="h-screen relative">
            <div className="w-full">
              <FormHeader
                onClick={onClick}
                title={"Add Product"}
                sub_title="Add your product and necessary information from here."
              />
            </div>

            <div className="w-full h-[75%] md:h-[80%] overflow-y-scroll py-3 px-6 md:px-4 mb-4">
              <ProductDetailsFormUp edit={false} />
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
                    onClick={placeProductHandler}
                    title={"Add Product"}
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

export default AddProduts;
