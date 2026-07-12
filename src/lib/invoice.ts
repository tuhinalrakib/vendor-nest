import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInvoicePDF = (order: any) => {
  const doc = new jsPDF();

  // Branding and Header
  doc.setFontSize(22);
  doc.setTextColor(79, 70, 229); // Indigo 600
  doc.text("VendorNest", 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("123 Tech Avenue, Suite 400", 14, 26);
  doc.text("Dhaka, Bangladesh 1212", 14, 31);
  doc.text("support@vendornest.com", 14, 36);

  // Invoice Title
  doc.setFontSize(16);
  doc.setTextColor(30, 30, 30);
  doc.text("INVOICE", 195, 20, { align: "right" });
  
  // Order details (Top Right)
  doc.setFontSize(10);
  doc.text(`Order ID: ${order.id || order.order_id || 'N/A'}`, 195, 26, { align: "right" });
  doc.text(`Date: ${new Date(order.created_at || Date.now()).toLocaleDateString()}`, 195, 31, { align: "right" });
  doc.text(`Status: ${order.status?.toUpperCase() || "PENDING"}`, 195, 36, { align: "right" });

  // Billing details
  doc.setFontSize(12);
  doc.setTextColor(50, 50, 50);
  doc.text("Billed To:", 14, 50);
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text(order.buyer_name || order.customer_name || "Valued Customer", 14, 56);
  if (order.email) doc.text(order.email, 14, 61);
  
  // Payment info
  doc.text("Payment Method:", 195, 50, { align: "right" });
  doc.text(order.payment_method?.toUpperCase() || "N/A", 195, 56, { align: "right" });

  // Table items
  const tableData = (order.items || []).map((item: any) => [
    item.product_name || item.name || "Product",
    item.quantity,
    `$${parseFloat(item.price || "0").toFixed(2)}`,
    `$${(item.quantity * parseFloat(item.price || "0")).toFixed(2)}`
  ]);

  if (tableData.length === 0) {
    tableData.push(["Items placeholder (fetch required)", 1, "$0.00", "$0.00"]);
  }

  autoTable(doc, {
    startY: 70,
    head: [["Product Name", "Qty", "Unit Price", "Total"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [79, 70, 229] }, // Indigo 600
    styles: { fontSize: 10, cellPadding: 5 },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { cellWidth: 20, halign: 'center' },
      2: { cellWidth: 35, halign: 'right' },
      3: { cellWidth: 35, halign: 'right' }
    }
  });

  // Totals
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  const totalAmount = parseFloat(order.total_amount || order.total || "0").toFixed(2);
  
  doc.setFontSize(11);
  doc.setTextColor(50, 50, 50);
  doc.text("Subtotal:", 140, finalY);
  doc.text(`$${totalAmount}`, 185, finalY, { align: "right" });
  
  doc.text("Discount:", 140, finalY + 6);
  doc.text("$0.00", 185, finalY + 6, { align: "right" });

  doc.setFontSize(13);
  doc.setTextColor(30, 30, 30);
  doc.text("Total:", 140, finalY + 16);
  doc.text(`$${totalAmount}`, 185, finalY + 16, { align: "right" });

  // Footer message
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text("Thank you for shopping with VendorNest!", 105, finalY + 40, { align: "center" });

  // Save the PDF
  doc.save(`Invoice_${order.id || order.order_id || "Order"}.pdf`);
};
