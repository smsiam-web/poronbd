import { jsPDF } from "jspdf";
import "./fonts/lialinurBanglaFont";
import "./fonts/LiAnis-normal";
import "./fonts/SolaimanLipi-normal";
import BarcodeComponent from "./BarcodeImage";
import { timestamp } from "@/app/utils/firebase";
<script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"></script>


// create random unique id
export const uuid = () => {
  return "xxxxxxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const formatDate = (date) => {
  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let dd = date.getDate();
  let mm = month[date.getMonth()];
  let yyyy = date.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  date = `${mm} ${dd}, ${yyyy}`;
  return date;
};

export const Last7Days = () => {
  const today = new Date();
  const oneDayAgo = new Date(today);
  const twoDaysAgo = new Date(today);
  const threeDaysAgo = new Date(today);
  const fourDaysAgo = new Date(today);
  const fiveDaysAgo = new Date(today);
  const sixDaysAgo = new Date(today);

  oneDayAgo.setDate(today.getDate() - 1);
  twoDaysAgo.setDate(today.getDate() - 2);
  threeDaysAgo.setDate(today.getDate() - 3);
  fourDaysAgo.setDate(today.getDate() - 4);
  fiveDaysAgo.setDate(today.getDate() - 5);
  sixDaysAgo.setDate(today.getDate() - 6);

  const result0 = formatDate(today);
  const result1 = formatDate(oneDayAgo);
  const result2 = formatDate(twoDaysAgo);
  const result3 = formatDate(threeDaysAgo);
  const result4 = formatDate(fourDaysAgo);
  const result5 = formatDate(fiveDaysAgo);
  const result6 = formatDate(sixDaysAgo);

  const result = [
    result0,
    result1,
    result2,
    result3,
    result4,
    result5,
    result6,
  ];

  return result.reverse();
};

export const Today = () => {
  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let date = new Date();
  let dd = date.getDate();
  let mm = month[date.getMonth()];
  let yyyy = date.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  date = `${mm} ${dd}, ${yyyy}`;
  return date;
};
export const TimeStampToDate = (timestamp) => {
  const month = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  if (!timestamp?.seconds) return "";

  let date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6);
  let dd = date.getDate();
  let mm = month[date.getMonth()];
  let yyyy = date.getFullYear();

  if (dd < 10) {
    dd = "0" + dd;
  }

  return `${mm} ${dd}, ${yyyy}`;
};


export const ToDateAndTime = (timestamp) => {
  if (!timestamp?.toDate || !timestamp || typeof timestamp.toDate !== "function") {
    return ""; // or return "N/A"
  }

  const date = timestamp.toDate();

  const dateStr = date.toLocaleDateString("en-GB", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "Asia/Dhaka",
  });

  const timeStr = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Dhaka",
  });

  return `${dateStr} at ${timeStr}`;
};



export const TodayDate = () => {
  let date = new Date();
  let dd = date.getDate();
  let mm = date.getMonth() + 1;
  let yyyy = date.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  date = `${dd}-${mm}-${yyyy}`;
  return date;
};

export const doubleDigit = (value) => {
  return value && value > 9 ? value : `0${value}`;
};

export const daysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate();
};

export const invoiceGenerate = (item) => {
  const doc = new jsPDF();

  let item_01 = "",
    item_01_quantity = "",
    item_01_price = "",
    item_01_total_price = "",
    item_02 = "",
    item_02_quantity = "",
    item_02_price = "",
    item_02_total_price = "",
    item_03 = "",
    item_03_quantity = "",
    item_03_price = "",
    item_03_total_price = "",
    item_04 = "",
    item_04_quantity = "",
    item_04_price = "",
    item_04_total_price = "",
    item_05 = "",
    item_05_quantity = "",
    item_05_price = "",
    item_05_total_price = "",
    item_06 = "",
    item_06_quantity = "",
    item_06_price = "",
    item_06_total_price = "";

  item.order.map((e, i) => {
    i++;
    if (i === 1) {
      item_01 = e.title || "";
      item_01_quantity = `${e.quantity}`;
      item_01_price = [e.price];
      item_01_total_price = `${e.total_price}/-`;
    } else if (i === 2) {
      item_02 = e.title || "";
      item_02_quantity = `${e.quantity}`;
      item_02_price = [e.price];
      item_02_total_price = `${e.total_price}/-`;
    } else if (i === 3) {
      item_03 = e.title || "";
      item_03_quantity = `${e.quantity}`;
      item_03_price = [e.price];
      item_03_total_price = `${e.total_price}/-`;
    } else if (i === 4) {
      item_04 = e.title || "";
      item_04_quantity = `${e.quantity}`;
      item_04_price = [e.price];
      item_04_total_price = `${e.total_price}/-`;
    } else if (i === 5) {
      item_05 = e.title || "";
      item_05_quantity = `${e.quantity}`;
      item_05_price = [e.price];
      item_05_total_price = `${e.total_price}/-`;
    } else if (i === 6) {
      item_06 = e.title || "";
      item_06_quantity = `${e.quantity}`;
      item_06_price = [e.price];
      item_06_total_price = `${e.total_price}/-`;
    }
  });

  // doc.text(document.querySelector(".content > h2").innerHTML, 5, 75);
  // doc.setFont("LiAbuUnicode");
  // doc.setFont("LiAnis");
  doc.setFont("SolaimanLipi");
  doc.addImage("/invoice/invoice.jpg", 0, 0, 210, 297);
  doc.text(item?.status, 91, 77);
  doc.text(item?.customer_details.customer_name, 33, 91.4);
  doc.text(item?.customer_details.phone_number, 33.3, 99);

  doc.text(item_01, 30, 139.6);
  doc.text(item_01_quantity, 116, 139.6);
  doc.text(item_01_price, 137, 139.6);
  doc.text(item_01_total_price, 168, 139.6);

  doc.text(item_02, 30, 154);
  doc.text(item_02_quantity, 116, 154);
  doc.text(item_02_price, 137, 154);
  doc.text(item_02_total_price, 168, 154);

  doc.text(item_03, 30, 167);
  doc.text(item_03_quantity, 116, 167);
  doc.text(item_03_price, 137, 167);
  doc.text(item_03_total_price, 168, 167);

  doc.text(item_04, 30, 180.8);
  doc.text(item_04_quantity, 116, 180.8);
  doc.text(item_04_price, 137, 180.8);
  doc.text(item_04_total_price, 168, 180.8);

  doc.text(item_05, 30, 194.6);
  doc.text(item_05_quantity, 116, 194.6);
  doc.text(item_05_price, 137, 194.6);
  doc.text(item_05_total_price, 168, 194.6);

  doc.text(item_06, 30, 208.2);
  doc.text(item_06_quantity, 116, 208.2);
  doc.text(item_06_price, 137, 208.2);
  doc.text(item_06_total_price, 168, 208.2);

  doc
    .setFontSize(12)
    .text(`[Note: ${item?.customer_details?.invoice_Note || ""}]`, 8, 218.2, {
      maxWidth: 120,
      align: "left",
    });
  doc.text(`${item?.totalPrice}/-`.toString(), 161, 225.5);
  doc.text("Home", 182, 233.8);
  doc.text(`${item?.deliveryCrg}/-`, 161, 233.8);
  doc.text(`-${item?.discount}/-`.toString(), 161, 242.2);

  doc
    .setFontSize(12)
    .text(item?.customer_details.customer_address, 36.4, 106.5, {
      maxWidth: 165,
      align: "left",
    });
  doc.text(item?.date, 93, 83.5);
  doc.setFont(undefined, "bold");
  doc.setFontSize(15).text(item?.id, 43, 83.5);
  doc
    .setFontSize(18)
    .text(`${item?.customer_details?.salePrice.toString()}.00/-`, 161, 255.5);

  // doc.save(item?.id);
  doc.autoPrint();
  //This is a key for printing
  doc.output("dataurlnewwindow");
};
function barcodeDataURL(value, options = {}) {
  const canvas = document.createElement('canvas');
  JsBarcode(canvas, String(value), {
    format: 'CODE128',
    width: 2,       // bar thickness (increase for denser bars)
    height: 60,     // bar height (px)
    displayValue: false,
    margin: 0,
    ...options,
  });
  return canvas.toDataURL('image/png'); // "data:image/png;base64,...."
}
export const generateStick = (item, barCodeImageLink) => {
  const doc = new jsPDF();
// ✅ Get page width once
const pageWidth = doc.internal.pageSize.getWidth();

// ✅ Center the barcode
// let image = `${barCodeImageLink}`;
const img = barcodeDataURL(item?.courier?.consignment_id);
const barcodeWidth = 150;
const barcodeHeight = 30;
const barcodeX = (pageWidth - barcodeWidth) / 2; // center horizontally
doc.addImage(img, barcodeX, 30, barcodeWidth, barcodeHeight);
  // doc.addImage(image, 30, 30, 140, 35);

  doc.setFontSize(22).text(`Created by SM.Devware.`, 105, 285);
  doc.setFontSize(34);
  doc.text(`Name: ${item?.customer_details.customer_name}`, 22, 100);
  doc.text(`Phone: ${item?.customer_details.phone_number}`, 22, 112);

  doc.text(`Hotline: +88 09647323700`, 30, 238);
  doc.text(`Address: Nouhata, Paba, Rajshahi.`, 9, 250);

  doc.text(`Address: `, 22, 124);
  doc.setFontSize(26).text(item?.customer_details.customer_address, 72, 124, {
    maxWidth: 140,
    align: "left",
  });

  // ✅ Center the consignment ID text
const consignmentId = `${item?.courier?.consignment_id}`;
doc.setFontSize(36);
const textWidth = doc.getTextWidth(consignmentId);
const textX = (pageWidth - textWidth) / 2;
doc.text(consignmentId, textX, 74);

  doc.setFont(undefined, "bold");
  // doc.setFontSize(26).text(`(WGT: ${item?.weight}kg)`, 6, 74);

  // ✅ Center "Jannat Fashion"
  // const pageWidth = doc.internal.pageSize.getWidth();
  const centerText = (text, y, fontSize = 36) => {
    doc.setFontSize(fontSize);
    const textWidth = doc.getTextWidth(text);
    const x = (pageWidth - textWidth) / 2;
    doc.text(text, x, y);
  };

  centerText("Jannat Fashion", 225, 36); // centered version
  centerText(
    `${item?.customer_details.delivery_type ? "HOME" : "POINT"} DELIVERY`,
    180,
    40
  );
  centerText(`COD: ${item?.customer_details.salePrice}/-`, 195, 40);

  doc.setFontSize(36).text("Receiver:", 15, 88);
  doc.setFontSize(36).text(`${item?.id}`, 120, 88);
  doc.setFontSize(36).text("Sender:", 15, 210);

  // Top brand title (can also be centered if you prefer)
  centerText("Jannat Fashion", 25, 55);

  centerText("Thanks for being with us.", 270, 36);

  doc.autoPrint();
  doc.output("dataurlnewwindow");
};

// export const generateStick = (item, barCodeImageLink) => {
//   const doc = new jsPDF();

//   let image = `${barCodeImageLink}`;
//   // console.log(image)

//   doc.addImage(image, 30, 30, 140, 35);

//   doc.setFontSize(22).text(`Created by SM.Devware.`, 105, 285);
//   doc.setFontSize(34);
//   doc.text(`Name: ${item?.customer_details.customer_name}`, 22, 100);
//   doc.text(`Phone: ${item?.customer_details.phone_number}`, 22, 112);

//   doc.text(`Hotline: +88 09647323700`, 30, 238);
//   doc.text(`Address: Nouhata, Paba, Rajshahi.`, 9, 250);

//   doc.text(`Address: `, 22, 124);
//   doc.setFontSize(26).text(item?.customer_details.customer_address, 72, 124, {
//     maxWidth: 140,
//     align: "left",
//   });
//   // doc.text(`Note: `, 22, 136);
//   // doc.setFontSize(28).text(`Some Note`, 54, 136);
//   doc.setFontSize(36).text(`${item?.courier?.consignment_id}`, 70, 74);
//   // doc.setFontSize(36).text(`${item?.id}`, 120, 88);

//   doc.setFont(undefined, "bold");
//   doc.setFontSize(26).text(`(WGT: ${item?.weight}kg)`, 6, 74);
//   doc.setFontSize(36).text("Jannat Fashion", 38, 225);
//   doc
//     .setFontSize(40)
//     .text(
//       `${item?.customer_details.delivery_type ? "HOME" : "POINT"} DELIVERY`,
//       42,
//       180
//     );
//   doc
//     .setFontSize(40)
//     .text(`COD: ${item?.customer_details.salePrice}/-`, 65, 195);
//   doc.setFontSize(36).text("Receiver:", 15, 88);
//   // doc.setFontSize(24).text(`(WGT:${item?.weight}kg)`, 12, 74);
//   doc.setFontSize(36).text(`${item?.id}`, 120, 88);
//   doc.setFontSize(36).text("Sender:", 15, 210);
//   doc.setFontSize(55).text("Jannat Fashion", 6, 25);
//   doc.setFontSize(36).text("Thanks for being with us.", 24, 270);

//   // doc.save(invoiceNo);
//   doc.autoPrint();
//   //This is a key for printing
//   doc.output("dataurlnewwindow");
// };

// utils/orderUtils.js
export const updateOrderStatus = async (db, orderId, orderData, newStatus) => {
  try {
    await db
      .collection("placeOrder")
      .doc(orderId)
      .set(
        {
          ...orderData,
          status: newStatus,
          timestamp: orderData.timestamp,
        },
        { merge: true }
      );
    return true; // Indicate success
  } catch (error) {
    console.error("Error updating status:", error);
    return false; // Indicate failure
  }
};

export const formatDateToDDMMYYYY = async (date) => {
  return new Promise((resolve) => {
    const day = String(date.getDate()).padStart(2, "0"); // Get the day and pad with 0 if needed
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
    const year = date.getFullYear(); // Get the full year

    const formattedDate = `${day}${month}${year}`;
    resolve(formattedDate);
  });
};
