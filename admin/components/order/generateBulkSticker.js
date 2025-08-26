import jsPDF from "jspdf";
import "../../utils/fonts/SolaimanLipi-normal";
import { TodayDate } from "@/admin/utils/helpers";

function generateBulkPrintStickers(invoiceArray) {
  console.log(invoiceArray);
  const doc = new jsPDF();
  const DEFAULT_FILENAME = TodayDate();
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
  invoiceArray.forEach((item, index) => {

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
   doc.text(`${index + 1}`, 10, 288); // Title
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
   // Add a new page unless it's the last data
    if (index < invoiceArray.length - 1) {
      doc.setFont(undefined, "normal");
      doc.addPage();
    }
  });

  // Save the PDF
  doc.save(`Bulk-Order(${invoiceArray.length})_${DEFAULT_FILENAME}.pdf`);
  // doc.save(data?.id);
  doc.autoPrint();
  //This is a key for printing
  doc.output("dataurlnewwindow");

  // OR open it in a new tab for direct printing
  // doc.output('dataurlnewwindow');
}

export default generateBulkPrintStickers;
