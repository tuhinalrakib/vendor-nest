"use client";

import React, { useState, useEffect } from "react";
import Table from "@/components/tables";
import api from "@/lib/api";
import Swal from "sweetalert2";
import { SearchIcon } from "@/components/icons";
import DynamicLoading from "@/components/dynamicLoading/DynamicLoading";

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  categoryName: string;
  stock: number;
  lowStockThreshold: number;
}

export default function SellerInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [stockFilter, setStockFilter] = useState<"All" | "Low Stock" | "Out of Stock" | "Healthy">("All");

  const fetchData = async () => {
    try {
      setIsLoading(true);
      // Fetch categories for mapping names
      const catRes = await api.get("/api/categories/");
      const catMap: { [id: string]: string } = {};
      catRes.data.forEach((c: any) => {
        catMap[c.id] = c.name;
      });

      // Fetch seller products
      const prodRes = await api.get("/api/products/");
      const mappedInventory: InventoryItem[] = prodRes.data.map((p: any) => ({
        id: p.id,
        name: p.name,
        sku: p.sku || "",
        category: p.category || "",
        categoryName: p.category ? (catMap[p.category] || "Unknown") : "Uncategorized",
        stock: p.stock || 0,
        lowStockThreshold: p.low_stock_threshold !== undefined ? p.low_stock_threshold : 10,
      }));
      setInventory(mappedInventory);
    } catch (err: any) {
      console.error("Failed to load inventory:", err);
      Swal.fire({
        title: "Error",
        text: "Failed to load inventory data from backend.",
        icon: "error",
        confirmButtonColor: "#4f46e5",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStockChange = async (itemId: string, delta: number) => {
    const item = inventory.find((i) => i.id === itemId);
    if (!item) return;

    const newStock = Math.max(0, item.stock + delta);

    // Optimistic UI update
    setInventory((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, stock: newStock } : i))
    );

    try {
      await api.patch(`/api/products/${itemId}/`, { stock: newStock });
    } catch (err: any) {
      console.error("Failed to update stock:", err);
      // Revert state change
      setInventory((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, stock: item.stock } : i))
      );
      Swal.fire({
        title: "Update Failed",
        text: err.response?.data?.detail || "Could not update stock level on server.",
        icon: "error",
        confirmButtonColor: "#4f46e5",
      });
    }
  };

  const handleThresholdChange = async (itemId: string, newThreshold: number) => {
    const item = inventory.find((i) => i.id === itemId);
    if (!item) return;

    const sanitizedThreshold = Math.max(0, newThreshold);

    // Optimistic UI update
    setInventory((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, lowStockThreshold: sanitizedThreshold } : i))
    );

    try {
      await api.patch(`/api/products/${itemId}/`, { low_stock_threshold: sanitizedThreshold });
    } catch (err: any) {
      console.error("Failed to update threshold:", err);
      // Revert state change
      setInventory((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, lowStockThreshold: item.lowStockThreshold } : i))
      );
      Swal.fire({
        title: "Update Failed",
        text: err.response?.data?.detail || "Could not update low stock threshold on server.",
        icon: "error",
        confirmButtonColor: "#4f46e5",
      });
    }
  };

  // Find all low-stock items (stock <= threshold)
  const lowStockItems = inventory.filter((item) => item.stock <= item.lowStockThreshold);

  // Search and filter inventory items
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());

    const isOut = item.stock === 0;
    const isLow = item.stock <= item.lowStockThreshold && item.stock > 0;
    const isHealthy = item.stock > item.lowStockThreshold;

    if (stockFilter === "Low Stock") return matchesSearch && isLow;
    if (stockFilter === "Out of Stock") return matchesSearch && isOut;
    if (stockFilter === "Healthy") return matchesSearch && isHealthy;
    return matchesSearch;
  });

  const columns = [
    {
      header: "Product / SKU",
      render: (item: InventoryItem) => (
        <div className="flex flex-col text-left">
          <span className="text-zinc-900 font-bold">{item.name}</span>
          <span className="text-[10px] text-zinc-400 font-mono font-bold">{item.sku}</span>
        </div>
      ),
    },
    {
      header: "Category",
      render: (item: InventoryItem) => (
        <span className="text-zinc-500 font-semibold">{item.categoryName}</span>
      ),
    },
    {
      header: "Low Stock Threshold",
      render: (item: InventoryItem) => (
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={item.lowStockThreshold}
            onChange={(e) => handleThresholdChange(item.id, parseInt(e.target.value) || 0)}
            className="w-16 h-8 text-center bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-bold focus:border-indigo-650 outline-none"
          />
          <span className="text-[10px] text-zinc-450 font-bold">units</span>
        </div>
      ),
    },
    {
      header: "Current Stock Level",
      render: (item: InventoryItem) => {
        const isOut = item.stock === 0;
        const isLow = item.stock <= item.lowStockThreshold && item.stock > 0;
        return (
          <div className="flex items-center gap-3">
            {/* Quick Adjust Buttons */}
            <button
              onClick={() => handleStockChange(item.id, -1)}
              className="w-7 h-7 bg-zinc-100 hover:bg-zinc-200 rounded-lg flex items-center justify-center font-bold text-zinc-700 transition-colors cursor-pointer"
            >
              -
            </button>
            <span className="w-12 text-center font-mono font-extrabold text-zinc-950">
              {item.stock}
            </span>
            <button
              onClick={() => handleStockChange(item.id, 1)}
              className="w-7 h-7 bg-zinc-100 hover:bg-zinc-200 rounded-lg flex items-center justify-center font-bold text-zinc-700 transition-colors cursor-pointer"
            >
              +
            </button>

            {/* Quick badges */}
            {isOut ? (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-red-50 text-red-700 border border-red-200 uppercase tracking-wide">
                Out of Stock
              </span>
            ) : isLow ? (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wide">
                Low Stock
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wide">
                Healthy
              </span>
            )}
          </div>
        );
      },
    },
  ];

  if(isLoading && inventory.length === 0) {
    return <DynamicLoading loadingText="Loading inventory database..."/>
  } 

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-left">
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-950">Inventory Control</h1>
        <p className="text-xs font-semibold text-zinc-400 mt-1">
          Perform quick audits, adjust inventory levels, and configure alert thresholds for your warehouse stock.
        </p>
      </div>

      {/* Alerts banner if low stock exists */}
      {!isLoading && lowStockItems.length > 0 && (
        <div className="p-4 bg-amber-50/60 border border-amber-100 rounded-2xl flex items-start gap-3.5 text-left animate-in fade-in duration-300">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <svg className="w-4.5 h-4.5 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-900">
              Low Stock Alert ({lowStockItems.length} items require attention)
            </h4>
            <p className="text-[10px] text-zinc-550 mt-1 font-semibold leading-relaxed">
              These products have fallen below their minimum stock thresholds. Restock immediately to prevent shipping delays and customer order cancellations.
            </p>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 bg-white border border-zinc-200 rounded-2xl">
        <div className="relative w-full sm:max-w-xs">
          <SearchIcon className="w-4.5 h-4.5 text-zinc-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search by product, SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none transition-all"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(["All", "Low Stock", "Out of Stock", "Healthy"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStockFilter(filter)}
              className={`px-4.5 h-11 rounded-xl text-xs font-bold transition-all duration-200 border whitespace-nowrap cursor-pointer ${
                stockFilter === filter
                  ? "bg-zinc-950 text-white border-zinc-950"
                  : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Table data={filteredInventory} columns={columns} />
    </div>
  );
}
