import { jsPDF } from "jspdf";
import "./fonts/lialinurBanglaFont";
import "./fonts/LiAnis-normal";
import "./fonts/SolaimanLipi-normal";
import { format } from "date-fns";
import autoTable from "jspdf-autotable";
<script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"></script>;

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

export const formatDates = (isoDate) => {
  if (!isoDate) return ""; // or return null, or "N/A"
  try {
    return format(new Date(isoDate), "MMM dd, yyyy");
  } catch {
    return "MMM dd, yyyy"; // fallback if invalid date string
  }
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
  if (
    !timestamp?.toDate ||
    !timestamp ||
    typeof timestamp.toDate !== "function"
  ) {
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
  const date = formatDates(item?.created_at);
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

  item.items.map((e, i) => {
    i++;
    if (i === 1) {
      item_01 = e.title || "";
      item_01_quantity = `${e.quantity}`;
      item_01_price = `${e.price}`;
      item_01_total_price = `${e.line_total}/-`;
    } else if (i === 2) {
      item_02 = e.title || "";
      item_02_quantity = `${e.quantity}`;
      item_02_price = `${e.price}`;
      item_02_total_price = `${e.line_total}/-`;
    } else if (i === 3) {
      item_03 = e.title || "";
      item_03_quantity = `${e.quantity}`;
      item_03_price = `${e.price}`;
      item_03_total_price = `${e.line_total}/-`;
    } else if (i === 4) {
      item_04 = e.title || "";
      item_04_quantity = `${e.quantity}`;
      item_04_price = `${e.price}`;
      item_04_total_price = `${e.line_total}/-`;
    } else if (i === 5) {
      item_05 = e.title || "";
      item_05_quantity = `${e.quantity}`;
      item_05_price = `${e.price}`;
      item_05_total_price = `${e.line_total}/-`;
    } else if (i === 6) {
      item_06 = e.title || "";
      item_06_quantity = `${e.quantity}`;
      item_06_price = `${e.price}`;
      item_06_total_price = `${e.line_total}/-`;
    }
  });

  // doc.text(document.querySelector(".content > h2").innerHTML, 5, 75);
  // doc.setFont("LiAbuUnicode");
  // doc.setFont("LiAnis");
  doc.setFont("SolaimanLipi");
  doc.addImage("/invoice/invoice.jpg", 0, 0, 210, 297);
  doc.text(item?.fulfillment?.order_status, 91, 77);
  doc.text(item?.customer?.name, 33, 91.4);
  doc.text(item?.customer?.phone, 33.3, 99);

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

  doc.setFontSize(12).text(`[Note: ${item?.meta?.notes || ""}]`, 8, 218.2, {
    maxWidth: 120,
    align: "left",
  });
  doc.text(`${item?.totals?.items}/-`.toString(), 161, 225.5);
  doc.text(`${item?.totals?.shipping}/-`, 161, 233.8);
  doc.text(`-${item?.totals?.discount}/-`.toString(), 161, 242.2);

  doc.setFontSize(12).text(`${item?.shipping_address?.street}`, 36.4, 106.5, {
    maxWidth: 165,
    align: "left",
  });
  doc.text(date, 93, 83.5);
  doc.setFont(undefined, "bold");
  doc.setFontSize(15).text(item?.orderID, 43, 83.5);
  doc
    .setFontSize(18)
    .text(`${item?.totals?.grand.toString()}.00/-`, 161, 255.5);

  // 🔥 Enable PDF auto-print (adds OpenAction in the PDF)
  doc.autoPrint();

  const fileName = `${
    item?.orderID || item?.fulfillment?.consignment_id || "order"
  }.pdf`;

  // Make a Blob + URL
  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);

  // ✅ Preview in a new tab + try to auto-print as soon as it loads
  const w = window.open("", "_blank");
  if (w) {
    w.document.write(`
    <html>
      <head><title>${fileName}</title></head>
      <body style="margin:0">
        <iframe id="pdf" src="${url}" style="border:0;width:100%;height:100vh;"></iframe>
        <script>
          const frame = document.getElementById('pdf');
          frame.addEventListener('load', () => {
            try {
              // Chrome সাধারণত OpenAction (autoPrint) রেস্পেক্ট করে।
              // তবু সেফটির জন্য প্রোগ্রাম্যাটিক প্রিন্টও ট্রাই করি:
              frame.contentWindow && frame.contentWindow.focus();
              frame.contentWindow && frame.contentWindow.print();
            } catch (e) {}
          });
          // ট্যাব বন্ধ হলে URL revoke
          window.addEventListener('beforeunload', () => URL.revokeObjectURL('${url}'));
        <\/script>
      </body>
    </html>
  `);
    w.document.close();
  } else {
    // popup blocked হলে fallback: শুধু ওপেন করুন
    window.open(url, "_blank");
  }

  // 🟦 (Optional) আলাদা বাটনে/অ্যাকশনে কাস্টম ফাইলনেম ডাউনলোড
  // একই blob URL ইউজ করলে খুব তাড়াতাড়ি revoke করবেন না
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();

  // ⚠️ খুব তাড়াতাড়ি revoke করলে নতুন ট্যাব লোড হতে নাও পারে। একটু দেরিতে revoke করুন:
  setTimeout(() => URL.revokeObjectURL(url), 60000); // 60s পরে নিরাপদে রিভোক

};
function barcodeDataURL(value, options = {}) {
  const canvas = document.createElement("canvas");
  JsBarcode(canvas, String(value), {
    format: "CODE128",
    width: 2, // bar thickness (increase for denser bars)
    height: 60, // bar height (px)
    displayValue: false,
    margin: 0,
    ...options,
  });
  return canvas.toDataURL("image/png"); // "data:image/png;base64,...."
}

// import "jspdf-autotable"; // লাগলে অটো-টেবিল ব্যবহার করতে পারেন; এখানে কাস্টম টেবিল দিয়েছি

// export const generateStick = (item) => {
//   const doc = new jsPDF({ unit: "mm" }); // ডিফল্ট A4, mm ইউনিট
//   const pageWidth = doc.internal.pageSize.getWidth();
//   const marginX = 10;

//   // ---------- helpers ----------
//   const centerText = (text, y, fontSize = 14, fontStyle = "normal") => {
//     doc.setFontSize(fontSize);
//     doc.setFont(undefined, fontStyle);
//     const textW = doc.getTextWidth(String(text || ""));
//     const x = (pageWidth - textW) / 2;
//     doc.text(String(text || ""), x, y);
//   };

//   const drawLabelValueRow = ({
//     y,
//     label,
//     value,
//     labelW = 35,
//     fontSize = 12,
//     colonX = marginX + labelW + 2,
//     valueX = marginX + labelW + 6,
//     valueMaxW = pageWidth - marginX - valueX,
//   }) => {
//     doc.setFontSize(fontSize);
//     // label
//     doc.setFont(undefined, "bold");
//     doc.text(String(label || ""), marginX, y);
//     // colon (aligned)
//     doc.setFont(undefined, "normal");
//     doc.text(":", colonX, y);
//     // value (wrap-able)
//     const wrapped = doc.splitTextToSize(String(value || ""), valueMaxW);
//     doc.text(wrapped, valueX, y);
//     // return how much height used
//     const lineHeight = fontSize * 0.5 + 3; // approx
//     const usedH = Math.max(lineHeight, wrapped.length * lineHeight);
//     return y + usedH; // next y
//   };

//   const drawBarcodeCentered = ({ dataUrl, y, w = 60, h = 18 }) => {
//     const x = (pageWidth - w) / 2;
//     doc.addImage(dataUrl, "PNG", x, y, w, h);
//   };

//   const drawItemsTable = ({
//     rows,
//     startY,
//     headerH = 9,
//     fontSize = 11,
//     rowMinH = 8,
//     borderColor = "#000000",
//   }) => {
//     // Columns: # | Item | Qty | Line
//     const tableW = pageWidth - marginX * 2;
//     const colW = {
//       sl: Math.max(12, tableW * 0.10),
//       item: Math.max(60, tableW * 0.55),
//       qty: Math.max(16, tableW * 0.15),
//       total: Math.max(18, tableW * 0.20),
//     };
//     // normalize widths to fit
//     const sumW = colW.sl + colW.item + colW.qty + colW.total;
//     const scale = tableW / sumW;
//     Object.keys(colW).forEach((k) => (colW[k] = +(colW[k] * scale).toFixed(2)));

//     let y = startY;

//     // header
//     doc.setDrawColor(borderColor);
//     doc.setLineWidth(0.2);
//     doc.setFillColor(240, 240, 240);
//     doc.rect(marginX, y, tableW, headerH, "FD");

//     doc.setFontSize(fontSize);
//     doc.setFont(undefined, "bold");
//     let x = marginX;

//     doc.text("#", x + 2, y + headerH - 3);
//     x += colW.sl;
//     doc.text("Item", x + 2, y + headerH - 3);
//     x += colW.item;
//     doc.text("Qty", x + colW.qty / 2, y + headerH - 3, { align: "center" });
//     x += colW.qty;
//     doc.text("Line", x + colW.total - 2, y + headerH - 3, { align: "right" });

//     y += headerH;

//     // rows
//     doc.setFont(undefined, "normal");

//     rows.forEach((r, idx) => {
//       const sl = String(idx + 1);
//       const itemText = String(r.title || "");
//       const qtyText = String(r.quantity ?? 0);
//       const lineText = (Number(r.line_total ?? (r.price || 0) * (r.quantity || 0))).toFixed(2);

//       // wrap item cell
//       const itemWrapped = doc.splitTextToSize(itemText, colW.item - 4);
//       const lineHeight = fontSize * 0.5 + 3; // approx
//       const rowH = Math.max(rowMinH, itemWrapped.length * lineHeight);

//       // row box
//       doc.rect(marginX, y, tableW, rowH);

//       // cells text
//       let cx = marginX;
//       // SL (center)
//       doc.text(sl, cx + colW.sl / 2, y + rowH / 2 + 2, { align: "center" });
//       cx += colW.sl;

//       // Item (multi-line)
//       doc.text(itemWrapped, cx + 2, y + 5);
//       cx += colW.item;

//       // Qty (center)
//       doc.text(qtyText, cx + colW.qty / 2, y + rowH / 2 + 2, { align: "center" });
//       cx += colW.qty;

//       // Line total (right)
//       doc.text(lineText, cx + colW.total - 2, y + rowH / 2 + 2, { align: "right" });

//       y += rowH;
//     });

//     return y;
//   };

//   // ---------- header / branding ----------
//   centerText("PORON", 18, 18, "bold");
//   centerText("Thanks for being with us.", 26, 12);
//   centerText("HOME DELIVERY", 34, 12);
//   centerText("Hotline: +88 01773-043533", 42, 12);
//   centerText("Address: Savar, Dhaka-1216", 50, 12);

//   // ---------- barcode + consignment ----------
//   const consignmentId = String(item?.fulfillment?.consignment_id || "");
//   try {
//     const img = barcodeDataURL(consignmentId);
//     drawBarcodeCentered({ dataUrl: img, y: 58, w: 80, h: 20 });
//   } catch (e) {
//     // barcode না পারলে শুধু আইডি দেখাই
//   }
//   centerText(consignmentId, 84, 18, "bold");

//   // ---------- receiver/sender + customer block ----------
//   let y = 98;

//   doc.setFont(undefined, "bold");
//   doc.setFontSize(14);
//   doc.text("Receiver", marginX, y);
//   doc.setFont(undefined, "normal");

//   y = drawLabelValueRow({
//     y: y + 8,
//     label: "Name",
//     value: item?.customer?.name || "",
//     labelW: 30,
//     fontSize: 12,
//   });

//   y = drawLabelValueRow({
//     y: y + 6,
//     label: "Phone",
//     value: item?.customer?.phone || "",
//     labelW: 30,
//     fontSize: 12,
//   });

//   y = drawLabelValueRow({
//     y: y + 6,
//     label: "Address",
//     value: item?.shipping_address?.street || "",
//     labelW: 30,
//     fontSize: 12,
//   });

//   // COD centered under receiver block
//   centerText(`COD: ${Number(item?.totals?.grand || 0).toFixed(2)}/-`, y + 8, 16, "bold");

//   // ---------- items table ----------
//   const items = Array.isArray(item?.items) ? item.items : [];
//   const rows = items.map((it) => {
//     // অপশনগুলো থাকলে টাইটেলে যোগ করি (e.g., Color: Black, Size: M)
//     const opt = Array.isArray(it?.options)
//       ? it.options
//           .filter((o) => o?.name && (o?.value[0].name || o?.value))
//           .map((o) => `${o.name}: ${o.value[0].name || o.value}`)
//           .join(", ")
//       : "";
//     const title = opt ? `${it.title} (${opt})` : it.title;
//     return {
//       title,
//       quantity: it.quantity ?? 1,
//       price: it.price ?? 0,
//       line_total: it.line_total ?? (it.price || 0) * (it.quantity || 0),
//     };
//   });

//   if (rows.length) {
//     const afterTableY = drawItemsTable({
//       rows,
//       startY: y + 20,
//       fontSize: 11,
//     });

//     // নিচে ছোট সারাংশ/ধন্যবাদ
//     centerText("— Thank you —", afterTableY + 10, 12);
//   } else {
//     // যদি আইটেম না থাকে, প্লেসহোল্ডার
//     doc.setFontSize(12);
//     doc.text("Items: (none)", marginX, y + 20);
//   }

//   // ---------- footer ----------
//   centerText("Created by SM.Devware.", 285, 12);

//   doc.autoPrint();
//   doc.output("dataurlnewwindow");
// };

// <-- NEW

// // আপনার বারকোড ডেটা ইউআরএল জেনারেটর
// // function barcodeDataURL(consignmentId) { ... }

// export const generateStick = (item) => {
//   const doc = new jsPDF(); // unit: mm (default)

//   // Page helpers
//   const pageWidth = doc.internal.pageSize.getWidth();
//   const centerText = (text, y, fontSize = 36, fontStyle = "normal") => {
//     doc.setFontSize(fontSize);
//     doc.setFont(undefined, fontStyle);
//     const textWidth = doc.getTextWidth(String(text || ""));
//     const x = (pageWidth - textWidth) / 2;
//     doc.text(String(text || ""), x, y);
//   };

//   // ---------------- BARCODE (centered)
//   const img = barcodeDataURL(item?.courier?.consignment_id || item?.fulfillment?.consignment_id);
//   const barcodeWidth = 150;
//   const barcodeHeight = 30;
//   const barcodeX = (pageWidth - barcodeWidth) / 2;
//   doc.addImage(img, barcodeX, 30, barcodeWidth, barcodeHeight);

//   // ---------------- CONSIGNMENT (centered)
//   const consignmentId = String(item?.fulfillment?.consignment_id || "");
//   if (consignmentId) {
//     doc.setFontSize(34);
//     const textWidth = doc.getTextWidth(consignmentId);
//     const textX = (pageWidth - textWidth) / 2;
//     doc.text(consignmentId, textX, 74);
//   }

//   // ---------------- RECEIVER INFO (left aligned)
//   doc.setFontSize(28);
//   doc.text(`Name`, 22, 100);
//   doc.text(`Phone`, 22, 112);
//   doc.text(`Address`, 22, 124);

//   doc.setFontSize(28);
//   doc.text(`:`, 60, 100);
//   doc.text(`:`, 60, 112);
//   doc.text(`:`, 60, 124);

//   doc.text(`${item?.customer?.name || ""}`, 65, 100);
//   doc.text(`${item?.customer?.phone || ""}`, 65, 112);

//   // Address may be long
//   doc.setFontSize(26);
//   doc.text(String(item?.shipping_address?.street || ""), 65, 124, {
//     maxWidth: 140,
//     align: "left",
//   });

//   // ---------------- ITEMS TABLE (NEW)
//   // টেবিলটা 140–185 mm এর মধ্যে রাখছি যাতে নিচের HOME DELIVERY / COD না ঢেকে দেয়
//   const startY = 140;
//   const stopY = 185;
//   const rowHeight = 8; // approx per row
//   const headerHeight = 8;

//   const items = Array.isArray(item?.items) ? item.items : [];
//   const currency = String(item?.currency || "BDT").toUpperCase();

//   // ডেটা মেপ করুন
//   const bodyRows = items.map((it, i) => {
//     const qty = Number(it?.quantity || 0);
//     const price = Number(it?.price || 0);
//     const total = Number(it?.line_total ?? qty * price);
//     const title = String(it?.title || "");
//     return [
//       i + 1,
//       title,
//       qty > 0 ? `${qty} ${it?.unit || ""}`.trim() : "",
//       formatMoney(price, currency),
//       formatMoney(total, currency),
//     ];
//   });

//   // ফিটিং রো সংখ্যা নির্ণয় করুন
//   const availableHeight = stopY - startY - headerHeight;
//   const maxRows = Math.max(0, Math.floor(availableHeight / rowHeight));
//   let renderedBody = bodyRows.slice(0, maxRows);
//   const hiddenCount = bodyRows.length - renderedBody.length;

//   if (hiddenCount > 0) {
//     // শেষ লাইনে “+N more” দেখান
//     renderedBody[renderedBody.length - 1][1] += `  (+${hiddenCount} more…)`;
//   }

//   if (renderedBody.length > 0) {
//     autoTable(doc, {
//       startY,
//       margin: { left: 15, right: 15 },
//       head: [["#", "Item", "Qty", "Price", "Total"]],
//       body: renderedBody,
//       styles: { fontSize: 10, cellPadding: 2, lineColor: 200, lineWidth: 0.1 },
//       headStyles: {
//         fontStyle: "bold",
//         fillColor: [240, 240, 240],
//         textColor: 20,
//         halign: "center",
//       },
//       columnStyles: {
//         0: { cellWidth: 10, halign: "center" }, // #
//         1: { cellWidth: "auto" },               // Item (flex)
//         2: { cellWidth: 26, halign: "center" }, // Qty
//         3: { cellWidth: 26, halign: "right" },  // Price
//         4: { cellWidth: 30, halign: "right" },  // Total
//       },
//       theme: "grid",
//       pageBreak: "avoid", // single label page only
//       didDrawPage: (d) => {
//         // Optional: draw a light separator above/below table if needed
//       },
//     });
//   } else {
//     // কোন আইটেম না থাকলে ছোটো একটা নোট
//     doc.setFontSize(14);
//     doc.text("No items", 16, startY + 6);
//   }

//   // ---------------- FOOTER / BRANDING (centered)
//   centerText(`HOME DELIVERY`, 195, 40);
//   centerText(`COD: ${formatMoney(item?.totals?.grand || 0, currency)}/-`, 210, 40);
//   centerText(`Hotline: +88 01773-043533`, 247, 28);
//   centerText(`Address: Savar, Dhaka-1216`, 259, 28);
//   doc.setFont(undefined, "bold");
//   centerText("PORON", 235, 36);
//   centerText("PORON", 25, 55);
//   centerText("Thanks for being with us.", 273, 34);

//   // Receiver/Sender row (আপনার আগের মতোই)
//   doc.setFontSize(34).text("Receiver:", 15, 88);
//   doc.setFontSize(34).text(`${item?.orderID || ""}`, 120, 88);
//   doc.setFontSize(34).text("Sender:", 15, 224);

//   // ---------------- PRINT / PREVIEW
//   // doc.autoPrint(); // auto print চাইলে রাখুন
//   doc.output("dataurlnewwindow");
// };

// ছোটো হেল্পার—টাকা ফরম্যাট

function formatMoney(v) {
  const n = Number(v || 0);
  // “৳” দেখাতে চাইলে:
  // const symbol = currency === "BDT" ? "৳" : currency + " ";
  // return `${symbol}${n.toFixed(2)}`;
  return `${n.toFixed(2)}`;
}

export const generateStick = (item) => {
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

  // টেবিলটা 140–185 mm এর মধ্যে রাখছি যাতে নিচের HOME DELIVERY / COD না ঢেকে দেয়
  const startY = 140;
  const stopY = 185;
  const rowHeight = 5; // approx per row
  const headerHeight = 5;

  const items = Array.isArray(item?.items) ? item.items : [];

  // ডেটা মেপ করুন
  const bodyRows = items.map((it, i) => {
    const opt = Array.isArray(it?.option)
      ? it.option.map((o) => `${o.value || o.value}`).join(", ")
      : "";
    const title = opt ? `${it.title} (${opt})` : it.title;
    const qty = Number(it?.quantity || 0);
    const price = Number(it?.price || 0);
    const total = Number(it?.line_total ?? qty * price);
    // const title = String(it?.title || "");
    return [
      i + 1,
      title,
      qty > 0 ? `${qty} ${it?.unit || ""}`.trim() : "",
      formatMoney(price),
      formatMoney(total),
    ];
  });

  // ফিটিং রো সংখ্যা নির্ণয় করুন
  const availableHeight = stopY - startY - headerHeight;
  const maxRows = Math.max(0, Math.floor(availableHeight / rowHeight));
  let renderedBody = bodyRows.slice(0, maxRows);
  const hiddenCount = bodyRows.length - renderedBody.length;

  if (hiddenCount > 0) {
    // শেষ লাইনে “+N more” দেখান
    renderedBody[renderedBody.length - 1][1] += `  (+${hiddenCount} more…)`;
  }

  if (renderedBody.length > 0) {
    autoTable(doc, {
      startY,
      margin: { left: 15, right: 15 },
      body: renderedBody, // 5-কলামের রো: [#, Item, Qty, Price, Total]
      theme: "grid",

      // 🔥 গ্লোবাল সেল স্টাইল
      styles: {
        fontSize: 14,
        cellPadding: 2,
        textColor: [0, 0, 0], // টেক্সট কালো
        lineColor: [0, 0, 0], // সেলের বর্ডার কালো
        lineWidth: 0.2,
        fillColor: null, // কোন ব্যাকগ্রাউন্ড না
      },
      bodyStyles: {
        textColor: [0, 0, 0], // বডি টেক্সট কালো
      },

      // 🔥 টেবিলের আউটার বর্ডারও কালো/পুরু
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.2,

      columnStyles: {
        0: { cellWidth: 10, halign: "center" }, // #
        1: { cellWidth: "auto" }, // Item
        2: { cellWidth: 16, halign: "center" }, // Qty
        3: { cellWidth: 26, halign: "right" }, // Price
        4: { cellWidth: 30, halign: "right" }, // Total
      },

      // (ঐচ্ছিক) একদম নিশ্চিত করতে:
      didDrawCell: (data) => {
        const d = data.doc;
        d.setTextColor(0, 0, 0);
        d.setDrawColor(0, 0, 0);
      },
    });
  } else {
    // কোন আইটেম না থাকলে ছোটো একটা নোট
    doc.setFontSize(14);
    doc.text("No items", 16, startY + 6);
  }

  doc.setFontSize(22).text(`Created by SM.Devware.`, 105, 285);
  doc.setFontSize(28);
  doc.text(`Name`, 22, 100);
  doc.text(`Phone`, 22, 112);
  doc.text(`${item?.customer?.name}`, 65, 100);
  doc.text(`${item?.customer?.phone}`, 65, 112);

  doc.text(`:`, 60, 124);
  doc.text(`:`, 60, 100);
  doc.text(`:`, 60, 112);

  doc.text(`Address`, 22, 124);

  doc.setFontSize(16).text(item?.shipping_address?.street, 65, 124, {
    maxWidth: 140,
    align: "left",
  });

  // ✅ Center the consignment ID text
  const consignmentId = `${item?.fulfillment?.consignment_id}`;
  doc.setFontSize(34);
  const textWidth = doc.getTextWidth(consignmentId);
  const textX = (pageWidth - textWidth) / 2;
  doc.text(consignmentId, textX, 74);

  // doc.setFontSize(26).text(`(WGT: ${item?.weight}kg)`, 6, 74);

  // ✅ Center "Jannat Fashion"
  // const pageWidth = doc.internal.pageSize.getWidth();
  const centerText = (text, y, fontSize = 36) => {
    doc.setFontSize(fontSize);
    const textWidth = doc.getTextWidth(text);
    const x = (pageWidth - textWidth) / 2;
    doc.text(text, x, y);
  };
  centerText(`Address: Savar, Dhaka-1216`, 259, 28);
  centerText(`Hotline: +88 01773-043533`, 247, 28);
  doc.setFont(undefined, "bold");
  centerText("PORON", 235, 36); // centered version
  centerText(`HOME DELIVERY`, 205, 40);
  centerText(`COD: ${item?.totals?.grand}/-`, 218, 40);

  doc.setFontSize(34).text("Receiver:", 15, 88);
  doc.setFontSize(34).text(`${item?.orderID}`, 120, 88);
  doc.setFontSize(34).text("Sender:", 15, 226);

  // Top brand title (can also be centered if you prefer)
  centerText("PORON", 25, 55);

  centerText("Thanks for being with us.", 273, 34);
  // const fileName = `${
  //   item?.orderID || item?.fulfillment?.consignment_id || "order"
  // }.pdf`;

  // const blob = doc.output("blob");
  // const url = URL.createObjectURL(blob); // নতুন ট্যাবে দেখান
  // window.open(url, "_blank");
  // // আলাদা কোনো বোতামে:
  // const a = document.createElement("a");
  // a.href = url;
  // a.download = fileName; // কাস্টম ফাইলনেম
  // a.click();
  // URL.revokeObjectURL(url);

  // ধরে নিচ্ছি doc = new jsPDF() দিয়ে PDF বানিয়ে ফেলেছেন
  // ... আপনার আঁকার কোড ...

  // 🔥 Enable PDF auto-print (adds OpenAction in the PDF)
  doc.autoPrint();

  const fileName = `${
    item?.orderID || item?.fulfillment?.consignment_id || "order"
  }.pdf`;

  // Make a Blob + URL
  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);

  // ✅ Preview in a new tab + try to auto-print as soon as it loads
  const w = window.open("", "_blank");
  if (w) {
    w.document.write(`
    <html>
      <head><title>${fileName}</title></head>
      <body style="margin:0">
        <iframe id="pdf" src="${url}" style="border:0;width:100%;height:100vh;"></iframe>
        <script>
          const frame = document.getElementById('pdf');
          frame.addEventListener('load', () => {
            try {
              // Chrome সাধারণত OpenAction (autoPrint) রেস্পেক্ট করে।
              // তবু সেফটির জন্য প্রোগ্রাম্যাটিক প্রিন্টও ট্রাই করি:
              frame.contentWindow && frame.contentWindow.focus();
              frame.contentWindow && frame.contentWindow.print();
            } catch (e) {}
          });
          // ট্যাব বন্ধ হলে URL revoke
          window.addEventListener('beforeunload', () => URL.revokeObjectURL('${url}'));
        <\/script>
      </body>
    </html>
  `);
    w.document.close();
  } else {
    // popup blocked হলে fallback: শুধু ওপেন করুন
    window.open(url, "_blank");
  }

  // 🟦 (Optional) আলাদা বাটনে/অ্যাকশনে কাস্টম ফাইলনেম ডাউনলোড
  // একই blob URL ইউজ করলে খুব তাড়াতাড়ি revoke করবেন না
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();

  // ⚠️ খুব তাড়াতাড়ি revoke করলে নতুন ট্যাব লোড হতে নাও পারে। একটু দেরিতে revoke করুন:
  setTimeout(() => URL.revokeObjectURL(url), 60000); // 60s পরে নিরাপদে রিভোক

  // doc.save(fileName);
  // doc.autoPrint();
  // doc.output("dataurlnewwindow");
};

export const updateOrderStatus = async (db, orderId, orderData, newStatus) => {
  try {
    await db
      .collection("orders")
      .doc(orderId)
      .set(
        {
          ...orderData,
          status: newStatus,
          updated_at: new Date().toISOString(),
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
