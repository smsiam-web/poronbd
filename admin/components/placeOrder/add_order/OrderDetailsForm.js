import React, { useEffect, useState } from "react";
import { Tabs } from "@mantine/core";
import {
  AppTextArea,
  FormDropdown,
  FormInput,
  FormRadio,
} from "../../shared/Form";
import { db } from "@/app/utils/firebase";
import { useSelector } from "react-redux";
import { selectSingleCustomer } from "@/app/redux/slices/singleCustomerSlice";
import { selectWeightDetails } from "@/app/redux/slices/tempWeightDetails";
import { selectUser } from "@/app/redux/slices/authSlice";
import { CATEGORY } from "@/admin/configs";
import FormDropdownOpt from "../../shared/Form/FormDropdownOpt";
import { FieldArray, getIn, useFormikContext } from "formik";

const OrderDetailsForm = ({ singleOrder, rest }) => {
  const [products, setProducts] = useState(null);
  const [khejurGur, setKhejurGur] = useState(null);
  const [AkherGur, setAkherGur] = useState(null);
  const [honey, setHoney] = useState(null);
  const [mosla, setMosla] = useState(null);
  const [other, setOthers] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [weightDetails, setweightDetails] = useState(null);
  const [courier, setCourier] = useState("pathao");

  //pathao city, zone, Area
  const [cities, setCities] = useState([]);
  const [zones, setZones] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedZone, setSelectedZone] = useState("");

  useEffect(() => {
    fetch("/api/pathao/cities")
      .then((res) => res.json())
      .then((data) => {
        console.log("City API response:", data); // ← check this
        setCities(data.data || []); // safest approach
      });
  }, []);

  useEffect(() => {
    fetch("/api/pathao/zones?citie")
      .then((res) => res.json())
      .then((data) => setZones(data.data || []));
  }, [selectedCity]);

  useEffect(() => {
    if (selectedZone) {
      fetch(`/api/pathao/areas?zone_id=${selectedZone}`)
        .then((res) => res.json())
        .then((data) => setAreas(data.data || []));
    }
  }, [selectedZone]);

  const user = useSelector(selectUser);

  const getCustomer = useSelector(selectSingleCustomer);
  const getWeightDetails = useSelector(selectWeightDetails);
  useEffect(() => {
    setCustomer(getCustomer);
    setweightDetails(getWeightDetails);
  }, [getCustomer, getWeightDetails]);

  // Get products from firebase database
  useEffect(() => {
    const unSub = db
      .collection("products")
      .orderBy("timestamp", "desc")
      .onSnapshot((snap) => {
        const item = [];
        snap.docs.map((doc) => {
          item.push(doc.data());
        });
        setProducts(item);
      });

    return () => {
      unSub();
    };
  }, []);
  const StuffList = [
    {
      name: "Rakibul Islam",
      id: "Rakibul Islam",
    },

    {
      name: "Siam Chowdhury",
      id: "Siam Chowdhury",
    },
    {
      name: "Admin",
      id: "Admin",
    },
  ];
  const OrderFrom = [
    {
      name: "Messenger Order",
      id: "Messenger Order",
    },
    {
      name: "Phone Call Order",
      id: "Phone Call Order",
    },
    {
      name: "WhatsApp Order",
      id: "WhatsApp Order",
    },
    {
      name: "Website Order",
      id: "Website Order",
    },
    {
      name: "Tele Sales",
      id: "Tele Sales",
    },
    {
      name: "Paikari Order",
      id: "Paikari Order",
    },
  ];
  const MarkAs = [
    {
      name: "Normal",
      id: "Normal",
    },
    {
      name: "Argent",
      id: "Argent",
    },
  ];
  const AdID = [
    {
      name: "W03",
      id: "W03",
    },
    {
      name: "W02",
      id: "W02",
    },
    {
      name: "W01",
      id: "W01",
    },
    {
      name: "8",
      id: "8",
    },
    {
      name: "7",
      id: "7",
    },
    {
      name: "6",
      id: "6",
    },
    {
      name: "5",
      id: "5",
    },
    {
      name: "4",
      id: "4",
    },
    {
      name: "3",
      id: "3",
    },

    {
      name: "2",
      id: "2",
    },
    {
      name: "1",
      id: "1",
    },
  ];


  const obj = singleOrder?.order;
  console.log(cities);

    const { values, setFieldValue } = useFormikContext(); // <-- no <any>
  
    const hasVariants = !!getIn(values, "has_variants");
  
    const generateItemOptions = () => {
      const colorVals = (getIn(values, "options[0].values") || [])
        .map((v) => (v ? v.value : ""))
        .filter(Boolean);
      const sizeVals = (getIn(values, "options[1].values") || [])
        .map((v) => (v ? v.value : ""))
        .filter(Boolean);
  
      const colors = colorVals.length ? colorVals : [""];
      const sizes = sizeVals.length ? sizeVals : [""];
  
      const rows = colors.flatMap((c) =>
        sizes.map((s) => {
          const option_values = [];
          if (c) option_values.push({ option_name: "Color", id: c });
          if (s) option_values.push({ option_name: "Size", id: s });
          return {
            sku: "",
            currency: getIn(values, "currency") || "BDT",
            price: "",
            compare_at_price: "",
            is_active: true,
            option_values,
          };
        })
      );
  
      setFieldValue(
        "variants",
        rows.length
          ? rows
          : [
              {
                sku: "",
                currency: getIn(values, "currency") || "BDT",
                price: "",
                compare_at_price: "",
                is_active: true,
                option_values: [],
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
            ]
      );
    };

  return (
    <div className="max-h-full">
      <div className="pb-2">
        <span>Delivery Type:</span>
        <FormRadio
          type="text"
          name="delivery_type"
          forTrue="Home"
          forFalse="Point"
        />
      </div>
      <div>
        <span>
          Phone Number<span className="text-red-600">*</span>
        </span>
        <FormInput
          type="text"
          max={11}
          name="phone_number"
          placeholder="+880"
        />
      </div>
      <div>
        <span>
          Name<span className="text-red-600">*</span>
        </span>
        <FormInput name="customer_name" placeholder="Name" />
      </div>
      <div>
        <span>
          Address<span className="text-red-600">*</span>
        </span>
        <span className="text-sub-title text-sm block">
          (maximum 300 characters)
        </span>
        <AppTextArea
          name="customer_address"
          placeholder="Ex: H#12, R#04, Sec# 4, Mirpur Dhaka."
        />
      </div>

      <div className="pb-3">
        {!!obj?.length && <span className="md:text-2xl">Order</span>}
        {!!obj?.length &&
          obj.map((item, i) => (
            <div key={i}>
              <div className="flex justify-between py-1 border-b sm:border-b-2">
                <div>
                  <h2
                    className="text-md md:text-xl text-slate-500 font-mono"
                    id={`item_0${++i}`}
                  >
                    {item.title}
                  </h2>
                </div>
                <div className="flex justify-between w-7/12">
                  <span
                    className="text-md md:text-xl text-slate-500 font-mono"
                    id={`item_0${i}_quantity`}
                  >
                    {item.quantity}kg
                  </span>
                  <span
                    className="text-md md:text-xl text-slate-500 font-mono"
                    id={`item_0${i}_price`}
                  >
                    {item.price}
                  </span>
                  <span
                    className="text-md md:text-xl text-slate-500 font-mono"
                    id={`item_0${i}_total_price`}
                  >
                    {item.total_price}/-
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>

      <div>
        <Tabs color="violet" defaultValue={CATEGORY[0]?.name} variant="pills">
          <Tabs.List>
            {CATEGORY?.map((item) => (
              <Tabs.Tab key={item?.name} value={item?.name}>
                {item?.name}
              </Tabs.Tab>
            ))}
          </Tabs.List>

          {CATEGORY?.map((cat) => (
            <Tabs.Panel value={cat?.name} key={cat?.name} pt="xs">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {products?.map(
                  (item) =>
                    item?.categories[0].id === cat?.name && (
                      <div
                        key={item?.id}
                        className="p-2 bg-blue-500 rounded-md col-span-1"
                      >
                        <span className="pb-10 text-md text-white">
                          {item?.variants[0].sku}
                        </span>
                        <div className="flex items-center pt-1 sm:pt-2">
                          <div className="w-2/3">
                            <FormInput
                              type="number"
                              name={item?.variants[0].sku}
                              placeholder=""
                            />
                          </div>

                          <span className="text-lg text-white font-bold">
                            .{item?.attributes?.Unit}
                          </span>
                          
                        </div>
                        <div className="flex gap-2">
                          {item?.options?.map((opt) => (
                            <div className="w-2/3" key={opt?.name}>
                            <FormDropdownOpt
                              name={`${item?.variants[0].sku}_${opt?.name}`}
                              placeholder={opt?.name}
                              items={opt?.values}
                            />
                          </div>
                          ))}
                        </div>
                          {/* VARIANTS LIST */}
                              {true && (
                                <div className="space-y-3 p-3 border rounded">
                                  <div className="font-medium">Variants (writes to product.variants[])</div>
                        
                                  <FieldArray
                                    name="items"
                                    render={({ push, remove }) => (
                                      <>
                                        {(getIn(values, "items") || []).map((_, i) => (
                                          <div key={i} className="grid grid-cols-6 gap-3 p-3 border rounded">
                                            <div className="col-span-6 flex items-center justify-between">
                                              <div className="font-medium">Items {i + 1}</div>
                                              <button
                                                type="button"
                                                className="text-sm text-red-500"
                                                onClick={() => remove(i)}
                                              >
                                                Remove
                                              </button>
                                            </div>
                        
                                            <div className="col-span-2">
                                              <span>SKU</span>
                                              <FormInput name={`variants[${i}].sku`} placeholder="SKU" />
                                            </div>
                        
                                           
                        
                                            <div>
                                              <span>Price (current)</span>
                                              <FormInput
                                                name={`variants[${i}].price`}
                                                placeholder="0.00"
                                                type="number"
                                              />
                                            </div>
                        
                                           
                                                            
                        
                                            {/* Option Values */}
                                            <div className="col-span-3">
                                              <span>Color</span>
                                              <FormDropdown
                                                name={`variants[${i}].option_values[0].value`}
                                                placeholder="Select color"
                                                items={(getIn(values, "options[0].values") || []).map(
                                                  (v) => ({ name: v.value, id: v.value })
                                                )}
                                              />
                                              <FormInput
                                                name={`variants[${i}].option_values[0].option_name`}
                                                defaultValue="Color"
                                                hidden
                                              />
                                            </div>
                                            <div className="col-span-3">
                                              <span>Size</span>
                                              <FormDropdown
                                                name={`variants[${i}].option_values[1].value`}
                                                placeholder="Select size"
                                                items={(getIn(values, "options[1].values") || []).map(
                                                  (v) => ({ name: v.value, id: v.value })
                                                )}
                                              />
                                              <FormInput
                                                name={`variants[${i}].option_values[1].option_name`}
                                                defaultValue="Size"
                                                hidden
                                              />
                                            </div>
                        
                                           
                                            
                                          </div>
                                        ))}
                        
                               
                                      </>
                                    )}
                                  />
                                </div>
                              )}
                        
                      </div>
                    )
                )}
              </div>
            </Tabs.Panel>
          ))}
        </Tabs>
      </div>
      <div className="mt-3">
        <span>
          Price<span className="text-red-600">*</span>
        </span>
        <FormInput type="number" name="salePrice" placeholder="Price" />
      </div>

      <div className="mt-3">
        <span>
          Received by<span className="text-red-600">*</span>
        </span>
        {(!singleOrder && user?.staff_role === "Sales Executive") ||
        user?.staff_role === "HR" ||
        user?.staff_role === "Admin" ||
        user?.staff_role === "Sales Manager" ? (
          <FormDropdown
            disabled
            name="received_by"
            placeholder="Order received by"
            items={StuffList}
          />
        ) : (
          <span className="block border px-3 py-3 rounded-md text-slate-500">
            {singleOrder?.customer_details?.received_by || "Null"}
          </span>
        )}
      </div>
      <div className="mt-3">
        <span>Ad ID</span>
        <FormDropdown name="ad_ID" placeholder="Ad ID" items={AdID} />
      </div>
      <div className="mt-3">
        <span>Order From</span>
        <FormDropdown
          name="order_from"
          // placeholder="Messenger Order"
          items={OrderFrom}
        />
      </div>
      <div className="mt-3">
        <span>Mark As</span>
        <FormDropdown
          name="markAs"
          // placeholder="Messenger Order"
          items={MarkAs}
        />
      </div>
      <div>
        <span>Invoice Note:</span>
        <span className="text-sub-title text-sm block">
          (maximum 400 characters)
        </span>
        <AppTextArea name="invoice_Note" placeholder="Invoice note..." />
      </div>
      <div>
        <span>Courier Note:</span>
        <span className="text-sub-title text-sm block">
          (maximum 400 characters)
        </span>
        <AppTextArea name="note" placeholder="Courier note..." />
      </div>
    </div>
  );
};

export default OrderDetailsForm;
