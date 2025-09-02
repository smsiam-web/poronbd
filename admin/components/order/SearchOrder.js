import React, { useEffect, useState, useRef } from "react";
import Button from "@/app/components/shared/Button";
import { AiOutlineAppstoreAdd, AiOutlinePrinter } from "react-icons/ai";
import { db } from "@/app/utils/firebase";
import { useDispatch, useSelector } from "react-redux";
import {
  ToDateAndTime,
  daysInMonth,
  generateStick,
  invoiceGenerate,
  updateOrderStatus,
} from "@/admin/utils/helpers";
import { updateSingleOrder } from "@/app/redux/slices/singleOrderSlice";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Tooltip } from "@mantine/core";
import { FaPrint } from "react-icons/fa";
import { useBarcode } from "next-barcode";
import { notifications } from "@mantine/notifications";
import { selectUser } from "@/app/redux/slices/authSlice";
import Link from "next/link";
import { HiOutlineDocumentDownload } from "react-icons/hi";
import { FiEdit } from "react-icons/fi";
import { selectOrder, updateOrder } from "@/app/redux/slices/orderSlice";
import { updateBulkOrder } from "@/app/redux/slices/bulkSlice";
import { selectAllOrder, updateAllOrder } from "@/app/redux/slices/allOrder";

const SearchOrder = ({ onClick }) => {
  const [currentValue, setCurrentValue] = useState("RA014");
  const [filterOrder, setFilterOrder] = useState(null);
  const [orders, setOrders] = useState(useSelector(selectAllOrder));
  const [order, setOrder] = useState(useSelector(selectOrder));
  const [bulkOrder, setBulkOrder] = useState([]);
  const [status, setStatus] = useState([]);
  const allOrders = useSelector(selectAllOrder);
  const [opened, { open, close }] = useDisclosure(false);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const buttonRef = (useRef < HTMLButtonElement) | (null > null);
  const [limits, setLimits] = useState(false);
  const [limit, setLimit] = useState(30);

  useEffect(() => {
    const fetchOrders = async () => {
      setOrders(allOrders); // Directly set the orders
    };
    fetchOrders();
  }, [allOrders]);

  useEffect(() => {
    if (!!opened) return;
    setCurrentValue("RA014");
    setFilterOrder(null);
  }, [opened]);
  useEffect(() => {
    setOrder(orders);
  }, [orders]);
  const handleChange = (e) => {
    setCurrentValue(e.currentTarget.value);
  };
  const toggleOpen = () => {
    opened ? setOpened(false) : setOpened(true);
  };

  const { inputRef } = useBarcode({
    value: `${filterOrder?.sfc?.consignment_id}`,
    options: {
      background: "#FFFFFF",
      displayValue: false,
      width: 3,
      height: 80,
    },
  });
  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.focus(); // Auto-focus the button when the component mounts
    }
  }, [filterOrder]);

  // Change Status from print Action and check print Status
  const stickerStatus = async (item) => {
    item.status === "Processing" ? updateStatus(item, "Shipped") : toggleOpen;
    item.status === "Processing" && generateStick(item, inputRef?.current.src);
  };

  // Change Status from print Action and check print Status
  const getInvoice = async (item) => {
    item.status === "Pending" && invoiceGenerate(item);

    item.status === "Pending"
      ? updateStatus(item, "Processing", item?.id)
      : toggleOpen;
    close();
    //   console.log(item);
  };
  // Change Status from status Action
  const onStatusChanged = async (e, id) => {
    e.preventDefault();
    const newStatus = e.target.value;
    await updateStatus(filterOrder, newStatus);
    setFilterOrder(null);
  };

  // // update status on firebase
  // const updateStatuss = async (i, status, id) => {
  //   await db
  //     .collection("placeOrder")
  //     .doc(id)
  //     .set(
  //       {
  //         ...i,
  //         timestamp: i.timestamp,
  //         status: status,
  //       },
  //       { merge: true }
  //     );

  //   notifications.show({
  //     title: "Status Updated Successfully",
  //     message: `Customer Name ${filterOrder?.customer_details.customer_name}, Order ID: #${filterOrder?.id}`,
  //     color: "blue",
  //   });
  //   close();
  // };

  const updateStatus = async (order, newStatus) => {
    const success = await updateOrderStatus(db, order.id, order, newStatus);
    if (success) {
      notifications.show({
        title: "Status Updated Successfully",
        message: `Order #${order.id} status changed to ${newStatus}.`,
        color: "blue",
      });
      close();
    } else {
      notifications.show({
        title: "Status Update Failed",
        message: "An error occurred while updating the status.",
        color: "red",
      });
    }
  };

  // // search config
  // useEffect(() => {
  //   let ss = [];
  //   if (!currentValue) {
  //     dispatch(updateOrder(orders));
  //     ss = [];
  //     return;
  //   }

  //   const res = orders.map((i) => {
  //     if (
  //       i.customer_details.customer_name
  //         .toLowerCase()
  //         .split(" ")
  //         .includes(currentValue?.toLowerCase())
  //     ) {
  //       ss.push({ ...i });
  //     } else if (i.customer_details.phone_number === currentValue) {
  //       ss.push({ ...i });
  //     } else if (i.id.toLowerCase() === currentValue.toLowerCase()) {
  //       ss.push({ ...i });
  //     } else if (
  //       i.customer_details.customer_name.toLowerCase() ===
  //       currentValue.toLowerCase()
  //     ) {
  //       ss.push({ ...i });
  //     } else if (
  //       i.customer_details.customer_address
  //         .toLowerCase()
  //         .split(" ")
  //         .includes(currentValue?.toLowerCase())
  //     ) {
  //       ss.push({ ...i });
  //     } else if (i.date === currentValue) {
  //       ss.push({ ...i });
  //     }
  //   });

  //   ss.length ? dispatch(updateOrder(ss)) : dispatch(updateOrder(orders));
  // }, [currentValue]);

  useEffect(() => {
    const value = currentValue?.toUpperCase();
    if (value?.split("0")[0] === "RA" && value.length === 9) {
      filter(value);
    }
  }, [currentValue]);

  // Function to handle status change
  const statusChange = async (e) => {
    if (user.staff_role !== "HR") return;
    e.preventDefault(); // Prevent default form submission behavior

    const statusFilter = e.target.value.toLowerCase(); // Get the selected status
    console.log(statusFilter, orders, order);
    let filteredOrders = [];

    if (statusFilter === "status") {
      dispatch(updateOrder(orders)); // Update orders in the Redux store
      dispatch(updateBulkOrder([])); // Reset bulk orders
      setStatus("Status");
      setBulkOrder([]);
      return;
    }

    // Filter orders based on the selected status
    orders.map((item) => {
      item?.status.toLowerCase() === statusFilter && filteredOrders.push(item);
    });
    // Update Redux state with the filtered or empty results
    dispatch(updateOrder(filteredOrders));

    dispatch(updateBulkOrder(filteredOrders)); // Update bulk orders in the Redux store

    // Reset bulk orders if not "Pending"
  };

  // // onLimits Config
  // const onLimitChanged = (e) => {
  //   e.preventDefault();
  //   // if(e.target.value === "All"){
  //   //   return;
  //   // }
  //   let limits = [];
  //   const date = new Date();
  //   const dateAgo = parseInt(e.target.value) - 1;

  //   const res = orders.map((item) => {
  //     if (item.timestamp.toDate().getMonth() === date.getMonth()) {
  //       if (item.timestamp.toDate().getDate() >= date.getDate() - dateAgo) {
  //         limits.push(item);
  //       }
  //     }

  //     if (
  //       date.getDate() - dateAgo < 1 &&
  //       date.getMonth() - 1 === item.timestamp.toDate().getMonth()
  //     ) {
  //       if (
  //         item.timestamp.toDate().getDate() >=
  //         daysInMonth(date.getMonth() - 1, date.getFullYear()) +
  //           date.getDate() -
  //           dateAgo
  //       ) {
  //         limits.push(item);
  //       }
  //     }
  //   });
  //   limits.length
  //     ? dispatch(updateOrder(limits))
  //     : dispatch(updateOrder(orders));
  // };

  const filter = async (id) => {
    await db
      .collection("orders")
      .doc(id)
      .get()
      .then((doc) => {
        if (!!doc.data()) {
          const singleOrder = { id: doc.id, ...doc.data() };
          dispatch(updateSingleOrder([singleOrder]));
          setFilterOrder(singleOrder);
          open();
        }
      });
  };

  useEffect(() => {
    setLimits(
      ((user.staff_role === "Admin" ||
        user.staff_role === "HR" ||
        user.staff_role === "CEO") &&
        true) ||
        false
    );
  }, []);

  useEffect(() => {
    limits ? setLimit(400) : setLimit(30);
  }, [limits]);

  // Get order from firebase database
  useEffect(() => {
    const unSub = db
      .collection("orders")
      .orderBy("created_at", "desc")
      .limit(limit)
      .onSnapshot((snap) => {
        const order = [];
        snap.docs.map((doc) => {
          order.push({
            id: doc.id,
            ...doc.data(),
            // timestamp: doc.data().timestamp?.toDate().getTime(),
          });
        });
        dispatch(updateAllOrder(order));
        dispatch(updateOrder(order));
      });
    return () => {
      unSub();
    };
  }, [limit]);

  return (
    <>
      <Modal opened={opened} onClose={close} size="xl" title="Found Data...">
        {filterOrder && (
          <div className="p-3">
            <div className="flex justify-end gap-2">
              <div
                className={`inline-block px-4 text-center ${
                  user.staff_role === "HR" ||
                  user.staff_role == "Admin" ||
                  user.staff_role === "Sales Manager"
                    ? ""
                    : "hidden"
                }`}
              >
                <select
                  className="bg-black flex items-center gap-1 px-3 py-2 rounded-md cursor-pointer text-xs text-white font-medium hover:shadow-lg transition-all duration-300"
                  onChange={(e) => onStatusChanged(e)}
                >
                  <option
                    value={filterOrder.status}
                    className="capitalize"
                    hidden
                  >
                    {filterOrder.status}
                  </option>

                  <option value="Pending">Pending</option>
                  {user.staff_role !== "Sales Manager" && (
                    <option value="Processing">Processing</option>
                  )}
                  {user.staff_role !== "Sales Manager" && (
                    <option value="Shipped">Shipped</option>
                  )}
                  {user.staff_role !== "Sales Manager" && (
                    <option value="Delivered">Delivered</option>
                  )}

                  <option value="Hold">Hold</option>
                  {user.staff_role !== "Sales Manager" && (
                    <option value="Returned">Returned</option>
                  )}

                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              {((filterOrder.status === "Pending" &&
                user.staff_role === "Sales Executive") ||
                user.staff_role === "HR" ||
                user?.staff_role === "Sales Manager" ||
                user?.staff_role === "Admin") && (
                <Link
                  href={`/place-order/edit-order/id=${filterOrder.id}`}
                >
                  <span className="bg-black flex items-center gap-1 px-3 py-2 rounded-md cursor-pointer  text-xs text-white font-medium hover:shadow-lg transition-all duration-300">
                    <FiEdit size={14} /> Edit
                  </span>
                </Link>
              )}
              <Link href={`/orders/invoice/id=${filterOrder.id}`}>
                <span className="bg-black flex items-center gap-1 px-3 py-2 rounded-md cursor-pointer  text-xs text-white font-medium hover:shadow-lg transition-all duration-300">
                  <HiOutlineDocumentDownload size={18} /> Invoice
                </span>
              </Link>
            </div>
            <div>
              <h1 className="text-center text-2xl font-semibold pb-1">
                ID #{filterOrder.id} ({filterOrder.status})
              </h1>
              <h1 className="text-center text-2xl font-semibold border-b pb-3">
                SFC #{filterOrder?.sfc?.consignment_id}
              </h1>
            </div>

            <div className="pt-3 flex justify-between w-full">
              <div className="w-7/12">
                <h2 className="text-lg font-semibold">
                  {filterOrder.customer_details.customer_name}
                </h2>
                <h2>
                  Address: {filterOrder.customer_details.customer_address}
                </h2>
                <h2>
                  Phone Numbaer: {filterOrder.customer_details.phone_number}
                </h2>
                <h2 className="text-slate-600">
                  Note: {filterOrder?.customer_details?.note || "N/A"}
                </h2>
              </div>
              <div className="w-4/12 text-end">
                <h3>{ToDateAndTime(filterOrder.timestamp)}</h3>
                <h3>
                  Order type:{" "}
                  {filterOrder.customer_details?.order_from || "N/A"}
                </h3>
                <h3>
                  Received by:{" "}
                  {filterOrder.customer_details?.received_by || "N/A"}
                </h3>
                <h3>
                  Entry by: {filterOrder?.placeBy?.user || filterOrder.placeBy}
                </h3>
                {filterOrder?.updateBy && (
                  <h3>Updated by: {filterOrder?.updateBy?.user || "N/A"}</h3>
                )}

                <h3>Weight: {filterOrder.weight}kg</h3>
              </div>
            </div>
            <h1 className="text-2xl">Order:</h1>
            <div className="border-t my-2">
              {filterOrder &&
                filterOrder.order.map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between py-1 md:py-1 border-b">
                      <div>
                        <h2
                          className="text-sm sm:text-xl text-title font-mono"
                          id={`item_0${++i}`}
                        >
                          {item.title}
                        </h2>
                      </div>
                      <div className="flex justify-between w-7/12">
                        <span
                          className="text-sm sm:text-xl text-title font-mono"
                          id={`item_0${i}_quantity`}
                        >
                          {item.quantity}kg
                        </span>
                        <span
                          className="text-sm sm:text-xl text-title font-mono"
                          id={`item_0${i}_price`}
                        >
                          {item.price}
                        </span>
                        <span
                          className="text-sm sm:text-xl text-title font-mono"
                          id={`item_0${i}_total_price`}
                        >
                          {item.total_price}/-
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <div className="flex justify-between mb-10 gap-5">
              <div className=" ">
                <h2 className="text-slate-600 ">
                  [Note: {filterOrder?.customer_details?.invoice_Note || "N/A"}]
                </h2>
              </div>
              <div className="text-sm flex ">
                <div className="text-sm sm:text-xl text-title font-semibold">
                  <h2>Sub-Total</h2>
                  <h2>Delivery</h2>
                  <h2>Discount</h2>
                  <h2>Total</h2>
                </div>
                <div className="text-sm sm:text-xl text-title font-semibold px-4">
                  <h2>:</h2>
                  <h2>:</h2>
                  <h2>:</h2>
                  <h2>:</h2>
                </div>
                <div className="text-sm sm:text-xl text-title font-semibold text-right">
                  <h2>{filterOrder?.totalPrice}/-</h2>
                  <h2>{filterOrder?.deliveryCrg}/-</h2>
                  <h2>-{filterOrder?.discount}/-</h2>
                  <h2>{filterOrder?.customer_details.salePrice}/-</h2>
                </div>
              </div>
            </div>
            <div className="flex gap-4 justify-end">
              {user.staff_role === "HR" &&
                filterOrder.status === "Processing" && (
                  <Tooltip label="Sticker" color="green" withArrow>
                    <button
                      title="Sticker"
                      className="bg-green-400 flex items-center gap-1 px-3 py-2 rounded-md cursor-pointer hover:bg-green-500 text-sm text-white font-medium hover:shadow-lg transition-all duration-300"
                      onClick={() => stickerStatus(filterOrder)}
                    >
                      <FaPrint size={14} /> Sticker
                    </button>
                  </Tooltip>
                )}
              {(user.staff_role === "HR" || user.staff_role === "Admin") &&
                filterOrder.status === "Pending" && (
                  <Tooltip label="Invoice" color="blue" withArrow>
                    <button
                      ref={buttonRef}
                      autoFocus
                      title="Invoice"
                      className="bg-blue-400 flex items-center gap-1 px-3 py-2 rounded-md cursor-pointer hover:bg-blue-500 text-sm text-white font-medium hover:shadow-lg transition-all duration-300"
                      onClick={() => getInvoice(filterOrder)}
                    >
                      <AiOutlinePrinter size={18} /> Invoice
                    </button>
                  </Tooltip>
                )}
            </div>
          </div>
        )}
      </Modal>
      <div className="hidden">
        <img ref={inputRef} alt="ok" />
      </div>
      <div className="min-w-0 rounded-lg overflow-hidden bg-gray-50  shadow-xs  mb-5">
        <div className="p-4">
          <div className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex">
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <div className="flex-grow-0  md:flex-grow lg:flex-grow xl:flex-grow">
                <input
                  className="block w-full px-3 py-1 text-sm focus:outline-neutral-200 leading-5 rounded-md  border-gray-200 h-14 bg-gray-100 border-transparent focus:bg-white"
                  type="text"
                  value={currentValue}
                  onChange={(e) => handleChange(e)}
                  placeholder="Search by #ID"
                />
              </div>
            </div>
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <select
                className="block w-full px-2 py-1 text-sm  focus:outline-none rounded-md form-select focus:border-gray-200 border-gray-200  focus:shadow-none leading-5 border h-14 bg-gray-100 border-transparent focus:bg-gray-50"
                id="roleItem"
                name="roleItem"
                // defaultValue={selectedSubNav}
                onChange={(e) => statusChange(e)}
              >
                <option>Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="hold">Hold</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            {/* <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <select
                className="block w-full px-2 py-1 text-sm  focus:outline-none rounded-md form-select focus:border-gray-200 border-gray-200  focus:shadow-none leading-5 border h-14 bg-gray-100 border-transparent focus:bg-white"
                onChange={(e) => onLimitChanged(e)}
              >
                <option value="All">Order limits</option>
                <option value="1">Today's orders</option>
                <option value="7">Last 7 days orders</option>
                <option value="10">Last 10 days orders</option>
                <option value="15">Last 15 days orders</option>
                <option value="30">Last 30 days orders</option>
              </select>
            </div> */}
            {/* <div className="w-full md:w-56 lg:w-56 xl:w-56">
              <Button
                onClick={() => BulkAction()}
                title="Bulk Print"
                className="bg-blue-400 hover:bg-blue-500 hover:shadow-lg transition-all duration-300 text-white w-full h-14"
                icon=<IoPrintOutline size={24} />
              />
            </div> */}
            <div className="w-full md:w-56 lg:w-56 xl:w-56">
              <Button
                onClick={onClick}
                title="Place Order"
                className="bg-blue-400 hover:bg-blue-500 hover:shadow-lg transition-all duration-300 text-white w-full h-14"
                icon=<AiOutlineAppstoreAdd size={24} />
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchOrder;
