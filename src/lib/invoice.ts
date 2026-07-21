import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Helper to load image and return HTMLImageElement or null
const loadImage = (url: string): Promise<HTMLImageElement | null> => {
  return new Promise((resolve) => {
    if (!url) return resolve(null);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
};

export const generateInvoicePDF = async (order: any) => {
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

  // Preload all item images
  const itemImages = await Promise.all(
    (order.items || []).map(async (item: any) => {
      const imageUrl = item.product_image || item.image || null;
      if (imageUrl) {
        const loadedImg = await loadImage(imageUrl);
        return { itemId: item.id, img: loadedImg };
      }
      return { itemId: item.id, img: null };
    })
  );

  const imageMap = new Map<string, HTMLImageElement | null>();
  itemImages.forEach(({ itemId, img }) => {
    imageMap.set(itemId, img);
  });

  // Table items - we add an empty string at column index 0 for the Image
  const tableData = (order.items || []).map((item: any) => [
    "", // Space for image
    item.product_name || item.name || "Product",
    item.quantity,
    `$${parseFloat(item.price || "0").toFixed(2)}`,
    `$${(item.quantity * parseFloat(item.price || "0")).toFixed(2)}`
  ]);

  if (tableData.length === 0) {
    tableData.push(["", "Items placeholder (fetch required)", 1, "$0.00", "$0.00"]);
  }

  autoTable(doc, {
    startY: 70,
    head: [["Image", "Product Name", "Qty", "Unit Price", "Total"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [79, 70, 229] }, // Indigo 600
    styles: { fontSize: 10, cellPadding: 5, minCellHeight: 15 },
    columnStyles: {
      0: { cellWidth: 20, halign: 'center' },
      1: { cellWidth: 70 },
      2: { cellWidth: 15, halign: 'center' },
      3: { cellWidth: 35, halign: 'right' },
      4: { cellWidth: 35, halign: 'right' }
    },
    didDrawCell: (data) => {
      // Draw product image inside first column body cells
      if (data.section === "body" && data.column.index === 0) {
        const item = (order.items || [])[data.row.index];
        if (item) {
          const img = imageMap.get(item.id);
          if (img) {
            // Draw image centered in cell
            const cellWidth = data.cell.width;
            const cellHeight = data.cell.height;
            const imgSize = 10; // Image width/height in mm
            const x = data.cell.x + (cellWidth - imgSize) / 2;
            const y = data.cell.y + (cellHeight - imgSize) / 2;
            try {
              // Guess the format (JPEG / PNG / WEBP)
              const src = img.src.toLowerCase();
              let format = "JPEG";
              if (src.includes(".png")) format = "PNG";
              else if (src.includes(".webp")) format = "WEBP";
              
              doc.addImage(img, format, x, y, imgSize, imgSize);
            } catch (err) {
              console.error("Failed to add image to PDF:", err);
            }
          } else {
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            const x = data.cell.x + 2;
            // Align vertically center approximately
            const y = data.cell.y + (data.cell.height / 2) + 2;
            doc.text("N/A", x, y, { align: "left" });
          }
        }
      }
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
