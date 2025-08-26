import React, { useState } from "react";

import * as Yup from "yup";
import { AppForm, FormBtn } from "../../shared/Form";

import FormHeader from "../../shared/FormHeader";
import { db, timestamp } from "@/app/utils/firebase";
import Button from "../../shared/Button";
import { useRouter } from "next/router";
import ProductDetailsFormUp from "./ProductDetailsFormUp";

const validationSchema = Yup.object().shape({
  id: Yup.number().optional(),
  store_id: Yup.number().optional(),
  single_sku: Yup.string().required("SKU is required"),
  title: Yup.string().required("Product title is required"),
  slug: Yup.string().required("Slug is required"),
  status: Yup.string().oneOf(["draft", "active", "archived"]).required(),
  brand: Yup.string().nullable(),
  description: Yup.string().nullable(),

  categories: Yup.array().of(
    Yup.object().shape({
      id: Yup.string().required(),
      name: Yup.string().optional(),
      slug: Yup.string().optional(),
    })
  ),

  options: Yup.array().of(
    Yup.object().shape({
      id: Yup.number().optional(),
      name: Yup.string().required("Option name is required"),
      values: Yup.array()
        .of(
          Yup.object().shape({
            id: Yup.number().optional(),
            value: Yup.string().required("Option value is required"),
            swatch_hex: Yup.string()
              .matches(/^#([0-9A-F]{3}){1,2}$/i, "Invalid color hex")
              .nullable(),
          })
        )
        .min(1, "Each option must have at least 1 value"),
    })
  ),

  variants: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.number().optional(),
        sku: Yup.string().required("SKU is required"),
        barcode: Yup.string().nullable(),
        price: Yup.number().required("Price is required").min(0),
        compare_at_price: Yup.number().nullable(),
        compare_at_price: Yup.number().nullable(),
        currency: Yup.string()
          .length(3, "Currency must be ISO code")
          .required(),
        is_active: Yup.boolean().required(),

        option_values: Yup.array()
          .of(
            Yup.object().shape({
              option_id: Yup.number().optional(),
              option_name: Yup.string().optional(),
              value_id: Yup.number().optional(),
              value: Yup.string().optional(),
            })
          )
          .min(1, "Variant must have option values"),

        inventory: Yup.array()
          .of(
            Yup.object().shape({
              location_code: Yup.string().required(),
              stock_on_hand: Yup.number().min(0).required(),
              stock_reserved: Yup.number().min(0).default(0),
              reorder_point: Yup.number().min(0).default(0),
              allow_backorder: Yup.boolean().default(false),
            })
          )
          .required("Inventory is required"),

        images: Yup.array()
          .of(
            Yup.object().shape({
              id: Yup.number().optional(),
              url: Yup.string().url().required(),
              alt_text: Yup.string().nullable(),
              position: Yup.number().required(),
            })
          )
          .optional(),

        weight_grams: Yup.number().min(0).nullable(),
        dimensions_cm: Yup.object()
          .shape({
            length: Yup.number().nullable(),
            width: Yup.number().nullable(),
            height: Yup.number().nullable(),
          })
          .nullable(),
      })
    )
    .min(1, "At least one variant is required"),

  attributes: Yup.object().nullable(),

  seo: Yup.object().shape({
    title: Yup.string().max(255).nullable(),
    description: Yup.string().max(300).nullable(),
  }),
});

const AddProduts = ({ onClick }) => {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const router = useRouter();

  const product_details = product && product[0]?.product_details;


  // save order details on firebase database
  const placeProductHandler = async (values, product_id, off_price) => {

    console.log(values);

    await db
      .collection("products")
      .doc(values?.id)
      .set({
         ...values,
      timestamp
      })
      // .then(router.push("/products/id=?" + product_id));
  };

  return (
    <main>
      <div>
        <AppForm
          initialValues={{
            // Product basics
            id: product_details?.id || "",
            title: product_details?.title || "",
            slug: product_details?.slug || "",
            status: product_details?.status || "draft",
            brand: product_details?.brand || "",
            description: product_details?.description || "",
            store_id: product_details?.store_id || "",
            single_sku: product_details?.single_sku || "",

            // Categories
            categories: product_details?.categories || [
              { id: "1" }, // parent
              { id: "2" }, // child
            ],

            // Flags
            has_variants: product_details?.has_variants ?? true,

            // Options (example: Color, Size)
            options: product_details?.options || [
              { name: "Color", values: [] },
              { name: "Size", values: [] },
            ],

            // Variants (at least one required)
            variants: product_details?.variants || [
              {
                sku: "",
                currency: "BDT",
                price: "",
                compare_at_price: "",
                is_active: true,
                option_values: [
                  { option_name: "Color", value: "" },
                  { option_name: "Size", value: "" },
                ],
                inventory: [
                  {
                    location_code: "MAIN",
                    stock_on_hand: 0,
                    stock_reserved: 0,
                    reorder_point: 0,
                    allow_backorder: false,
                  },
                ],
              },
            ],

            // Attributes (flexible key-values)
            attributes: product_details?.attributes || {
              Unit: product_details?.unit || "",
              Tags: product_details?.product_tag || "",
              ProductType: product_details?.product_type || "type",
            },

            // SEO
            seo: product_details?.seo || {
              title: "",
              description: "",
            },

            // Extra fields
            available_from: product_details?.available_from || "",
          }}
          onSubmit={placeProductHandler}
          validationSchema={validationSchema}
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
              <ProductDetailsFormUp />
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
                    // loading={loading}
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
