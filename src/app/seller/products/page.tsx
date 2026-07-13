"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Table from "@/components/tables";
import { AddIcon, SearchIcon, TrashIcon, EditIcon } from "@/components/icons";
import Swal from "sweetalert2";
import api from "@/lib/api";
import Loading from "@/app/loading";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import DynamicLoading from "@/components/dynamicLoading/DynamicLoading";
import { useAuth } from "@/lib/AuthContext";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string; // Keeps the Category ID
  categoryName?: string; // Mapped Category name
  price: number;
  compareAtPrice?: number;
  stock: number;
  status: "Active" | "Out of Stock" | "Draft";
  image?: string;
  description?: string;
  color?: string;
  sizes?: string;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string;
}

export default function SellerProducts() {
  const router = useRouter();
  const { maintenanceMode, user } = useAuth();
  const plan = user?.seller_profile?.plan || "starter";
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Out of Stock" | "Draft">("All");

  const handleAddProductClick = () => {
    if (plan === "starter" && products.length >= 15) {
      Swal.fire({
        title: "Product Limit Reached",
        text: "You have reached the maximum limit of 15 products allowed on the Starter plan. Please upgrade to Growth or Scale Enterprise to add more products.",
        icon: "warning",
        confirmButtonText: "Upgrade Subscription Plan",
        showCancelButton: true,
        cancelButtonText: "Close",
        confirmButtonColor: "#4f46e5",
        cancelButtonColor: "#6b7280",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/seller/settings");
        }
      });
      return;
    }
    router.push("/seller/add-product");
  };

  // Edit Product Modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Version Control History Modal state
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyLogs, setHistoryLogs] = useState<any[]>([]);
  const [historyProduct, setHistoryProduct] = useState<Product | null>(null);
  
  const [editProductForm, setEditProductForm] = useState({
    name: "",
    price: "",
    compareAtPrice: "",
    sku: "",
    stock: "",
    category: "",
    description: "",
    color: "",
    sizes: "",
    seoTitle: "",
    seoDescription: "",
    tags: "",
    is_digital: false,
    digital_file_url: "",
    license_keys: "",
    publish_at: "",
    name_bn: "",
    description_bn: "",
  });

  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [isGeneratingSeo, setIsGeneratingSeo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      // Fetch categories for mapping names
      const catRes = await api.get("/api/categories/");
      setCategories(catRes.data);
      const catMap: { [id: string]: string } = {};
      catRes.data.forEach((c: any) => {
        catMap[c.id] = c.name;
      });

      // Fetch seller products
      const prodRes = await api.get("/api/products/");
      const mappedProducts: Product[] = prodRes.data.map((p: any) => ({
        id: p.id,
        name: p.name,
        sku: p.sku || "",
        category: p.category || "",
        categoryName: p.category ? (catMap[p.category] || "Unknown") : "Uncategorized",
        price: parseFloat(p.price) || 0,
        compareAtPrice: p.compare_at_price ? parseFloat(p.compare_at_price) : undefined,
        stock: p.stock || 0,
        status: p.stock === 0 ? "Out of Stock" : "Active",
        image: p.image || undefined,
        description: p.description || "",
        color: p.color || "",
        sizes: p.sizes || "",
        seoTitle: p.seo_title || "",
        seoDescription: p.seo_description || "",
        tags: p.tags || "",
        is_digital: p.is_digital || false,
        digital_file_url: p.digital_file_url || "",
        license_keys: p.license_keys || "",
        publish_at: p.publish_at || "",
        name_bn: p.name_bn || "",
        description_bn: p.description_bn || "",
        approval_status: p.approval_status || "approved",
      }));
      setProducts(mappedProducts);
    } catch (err: any) {
      console.error("Failed to load products:", err);
      Swal.fire({
        title: "Error",
        text: "Failed to load products from backend.",
        icon: "error",
        confirmButtonColor: "#4f46e5",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      Swal.fire({
        title: 'Exporting Catalog...',
        text: 'Generating CSV file...',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
      });
      const response = await api.get("/api/products/bulk-export/", {
        responseType: 'blob'
      });
      Swal.close();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'vendornest_products_export.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      Swal.close();
      console.error("CSV Export failed:", err);
      Swal.fire("Export Failed", "Could not export products to CSV.", "error");
    }
  };

  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      
      Swal.fire({
        title: 'Importing Products...',
        text: 'Parsing CSV details...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      
      try {
        const res = await api.post("/api/products/bulk-import/", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        Swal.close();
        if (res.data.errors && res.data.errors.length > 0) {
          Swal.fire({
            title: "Import Finished with Warnings",
            html: `<div class="text-left"><p>Successfully created <strong>${res.data.created}</strong> products.</p><p>Skipped <strong>${res.data.skipped}</strong> rows due to errors:</p><pre class="bg-zinc-50 p-2 text-xs text-red-500 rounded border mt-2 max-h-32 overflow-y-auto">${res.data.errors.join('\n')}</pre></div>`,
            icon: "warning"
          });
        } else {
          Swal.fire("Import Complete", `Successfully imported ${res.data.created} products.`, "success");
        }
        fetchData();
      } catch (err) {
        Swal.close();
        console.error("CSV Import failed:", err);
        Swal.fire("Import Failed", "Ensure your CSV format matches required header fields.", "error");
      }
    }
  };

  const handleViewHistory = async (product: Product) => {
    setHistoryProduct(product);
    try {
      Swal.fire({
        title: 'Loading History Logs...',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
      });
      const res = await api.get(`/api/products/${product.id}/versions/`);
      setHistoryLogs(res.data);
      Swal.close();
      setShowHistoryModal(true);
    } catch (err) {
      Swal.close();
      Swal.fire("Error", "Could not fetch version control log.", "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const generateSKUSuggestion = (categoryName: string, priceStr: string) => {
    if (!categoryName) return "";
    const words = categoryName.split(/\s+/);
    let initials = "";
    for (const word of words) {
      const cleanWord = word.replace(/[^a-zA-Z]/g, "");
      if (cleanWord) {
        initials += cleanWord[0].toUpperCase();
      }
    }
    const cleanInitials = initials || "PROD";
    const numericPrice = Math.floor(parseFloat(priceStr)) || 0;
    
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let suffix = "";
    for (let i = 0; i < 4; i++) {
      suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${cleanInitials}-${numericPrice}-${suffix}`;
  };

  const handleAutoGenerateSku = () => {
    const selectedCat = categories.find(c => c.id === editProductForm.category);
    const catName = selectedCat ? selectedCat.name : "";
    if (!catName || !editProductForm.price) {
      Swal.fire({
        title: "Missing Fields",
        text: "Please select a Category and enter a Price first to generate a SKU.",
        icon: "warning",
        confirmButtonColor: "#4f46e5",
      });
      return;
    }
    const suggestedSku = generateSKUSuggestion(catName, editProductForm.price);
    setEditProductForm(prev => ({ ...prev, sku: suggestedSku }));
  };

  const handleGenerateDescription = async () => {
    if (!editProductForm.name) {
      Swal.fire({
        title: "Product Title Required",
        text: "Please enter a product title to generate a description.",
        icon: "warning",
        confirmButtonColor: "#4f46e5",
      });
      return;
    }
    setIsGeneratingDesc(true);
    try {
      const response = await api.post("/api/ai/generate-description/", {
        name: editProductForm.name,
        category: editProductForm.category,
      });
      const data = response.data;
      setEditProductForm((prev) => ({ ...prev, description: data.content }));
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Description generated by AI!",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || "Failed to connect to AI server.";
      Swal.fire({
        title: "AI Generation Failed",
        text: errorMsg,
        icon: "error",
        confirmButtonColor: "#4f46e5",
      });
    } finally {
      setIsGeneratingDesc(false);
    }
  };

  const handleGenerateSEO = async () => {
    if (!editProductForm.name) {
      Swal.fire({
        title: "Product Title Required",
        text: "Please enter a product title to generate SEO tags.",
        icon: "warning",
        confirmButtonColor: "#4f46e5",
      });
      return;
    }
    setIsGeneratingSeo(true);
    try {
      const response = await api.post("/api/ai/generate-seo/", {
        name: editProductForm.name,
        category: editProductForm.category,
        description: editProductForm.description,
      });
      const data = response.data;
      setEditProductForm((prev) => ({
        ...prev,
        seoTitle: data.meta_title,
        seoDescription: data.meta_description,
        tags: data.tags ? data.tags.join(", ") : "",
      }));
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "SEO & Tags generated by AI!",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || "Failed to generate SEO tags.";
      Swal.fire({
        title: "Generation Failed",
        text: errorMsg,
        icon: "error",
        confirmButtonColor: "#4f46e5",
      });
    } finally {
      setIsGeneratingSeo(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (product: Product) => {
    setEditProductId(product.id);
    setEditProductForm({
      name: product.name || "",
      price: product.price?.toString() || "",
      compareAtPrice: product.compareAtPrice?.toString() || "",
      sku: product.sku || "",
      stock: product.stock?.toString() || "",
      category: product.category || "",
      description: product.description || "",
      color: product.color || "",
      sizes: product.sizes || "",
      seoTitle: product.seoTitle || "",
      seoDescription: product.seoDescription || "",
      tags: product.tags || "",
      is_digital: (product as any).is_digital || false,
      digital_file_url: (product as any).digital_file_url || "",
      license_keys: (product as any).license_keys || "",
      publish_at: (product as any).publish_at ? (product as any).publish_at.substring(0, 16) : "",
      name_bn: (product as any).name_bn || "",
      description_bn: (product as any).description_bn || "",
    });
    setImagePreview(product.image || null);
    setImageFile(null);
    setShowEditModal(true);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProductForm.name || !editProductForm.price || !editProductForm.category) {
      Swal.fire({
        title: "Missing Fields",
        text: "Please fill in all required fields.",
        icon: "error",
        confirmButtonColor: "#4f46e5",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
      }

      const data = new FormData();
      data.append("name", editProductForm.name);
      data.append("price", editProductForm.price);
      data.append("category", editProductForm.category);
      if (editProductForm.sku) data.append("sku", editProductForm.sku);
      if (editProductForm.compareAtPrice) data.append("compare_at_price", editProductForm.compareAtPrice);
      if (editProductForm.stock) data.append("stock", editProductForm.stock);
      if (editProductForm.description) data.append("description", editProductForm.description);
      if (editProductForm.color) data.append("color", editProductForm.color);
      if (editProductForm.sizes) data.append("sizes", editProductForm.sizes);
      if (editProductForm.seoTitle) data.append("seo_title", editProductForm.seoTitle);
      if (editProductForm.seoDescription) data.append("seo_description", editProductForm.seoDescription);
      
      data.append("is_digital", editProductForm.is_digital ? "true" : "false");
      data.append("digital_file_url", editProductForm.digital_file_url || "");
      data.append("license_keys", editProductForm.license_keys || "");
      if (editProductForm.publish_at) {
        data.append("publish_at", new Date(editProductForm.publish_at).toISOString());
      } else {
        data.append("publish_at", "");
      }
      data.append("name_bn", editProductForm.name_bn || "");
      data.append("description_bn", editProductForm.description_bn || "");
      if (imageUrl) {
        data.append("image", imageUrl);
      } else if (imagePreview) {
        // If image wasn't changed but exists
        data.append("image", imagePreview);
      }

      const tagsList: string[] = [];
      if (editProductForm.tags) {
        editProductForm.tags.split(",").forEach(t => {
          const val = t.trim();
          if (val) tagsList.push(val);
        });
      }
      if (tagsList.length > 0) {
        data.append("tags", tagsList.join(", "));
      }

      await api.patch(`/api/products/${editProductId}/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        title: "Product Updated",
        text: `Successfully updated product "${editProductForm.name}".`,
        icon: "success",
        confirmButtonColor: "#4f46e5",
      });

      setShowEditModal(false);
      fetchData();
    } catch (err: any) {
      console.error("Failed to update product:", err);
      const errMsg = err.response?.data?.detail || err.response?.data?.message || "Failed to update product.";
      Swal.fire({
        title: "Update Failed",
        text: errMsg,
        icon: "error",
        confirmButtonColor: "#4f46e5",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    if (maintenanceMode) {
      Swal.fire("Maintenance Mode Active", "Cannot delete products during platform maintenance.", "warning");
      return;
    }
    Swal.fire({
      title: "Delete Product?",
      text: "Are you sure you want to delete this product from your catalogue?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/api/products/${id}/`);
          setProducts(products.filter((p) => p.id !== id));
          Swal.fire({
            title: "Deleted!",
            text: "Product has been deleted.",
            icon: "success",
            confirmButtonColor: "#4f46e5",
          });
        } catch (err: any) {
          console.error("Failed to delete product:", err);
          Swal.fire({
            title: "Error",
            text: "Could not delete product from backend.",
            icon: "error",
            confirmButtonColor: "#4f46e5",
          });
        }
      }
    });
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      header: "Product Details",
      render: (product: Product) => (
        <div className="flex items-center gap-3.5 text-left">
          <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-150 flex items-center justify-center overflow-hidden shrink-0">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[10px] font-extrabold text-zinc-400">IMG</span>
            )}
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-950 leading-tight">{product.name}</h4>
            {product.sku && <span className="text-[10px] font-mono font-bold text-zinc-400">{product.sku}</span>}
          </div>
        </div>
      ),
    },
    {
      header: "Category",
      render: (product: Product) => (
        <span className="text-zinc-500 font-semibold">{product.categoryName}</span>
      ),
    },
    {
      header: "Price",
      render: (product: Product) => (
        <span className="text-zinc-950 font-extrabold">${product.price.toFixed(2)}</span>
      ),
    },
    {
      header: "Stock Level",
      render: (product: Product) => {
        const isLow = product.stock <= 10 && product.stock > 0;
        const isOut = product.stock === 0;
        return (
          <div className="flex flex-col text-left">
            <span className="text-zinc-950 font-bold">{product.stock} units</span>
            {isOut ? (
              <span className="text-[9px] font-extrabold uppercase text-red-500">Out of Stock</span>
            ) : isLow ? (
              <span className="text-[9px] font-extrabold uppercase text-amber-500">Low Stock</span>
            ) : (
              <span className="text-[9px] font-extrabold uppercase text-emerald-500">In Stock</span>
            )}
          </div>
        );
      },
    },
    {
      header: "Status",
      render: (product: Product) => {
        const badges = {
          Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
          "Out of Stock": "bg-red-50 text-red-700 border-red-200",
          Draft: "bg-zinc-50 text-zinc-500 border-zinc-200",
        };
        return (
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-bold border ${badges[product.status]}`}
          >
            {product.status}
          </span>
        );
      },
    },
    {
      header: "Actions",
      render: (product: Product) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewHistory(product)}
            className="p-1.5 hover:bg-indigo-50 rounded-lg text-zinc-450 hover:text-indigo-600 transition-colors cursor-pointer"
            title="View Edit History"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button
            onClick={() => handleEdit(product)}
            className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-500 hover:text-zinc-955 transition-colors cursor-pointer"
            title="Edit Product"
          >
            <EditIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(product.id)}
            disabled={maintenanceMode}
            className="p-1.5 hover:bg-red-50 rounded-lg text-zinc-450 hover:text-red-655 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            title={maintenanceMode ? "Delete Disabled (Maintenance)" : "Delete Product"}
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  if(isLoading) return <DynamicLoading loadingText="Loading products database..."/>

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-955">Store Products</h1>
          <p className="text-xs font-semibold text-zinc-400 mt-1">
            Displaying all items currently configured on your storefront catalog.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* CSV Import Trigger */}
          <label className={`h-11 px-4 border border-zinc-200 bg-white text-zinc-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs select-none ${maintenanceMode ? "opacity-50 pointer-events-none" : "hover:bg-zinc-50"}`}>
            <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Import CSV
            <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" disabled={maintenanceMode} />
          </label>

          {/* CSV Export Trigger */}
          <button
            onClick={handleExportCSV}
            className="h-11 px-4 border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>

          <button
            onClick={handleAddProductClick}
            disabled={maintenanceMode}
            className="h-11 px-5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-300 disabled:text-zinc-500 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/10 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
          >
            <AddIcon className="w-4.5 h-4.5" />
            Add Product
          </button>
        </div>
      </div>

      {/* Filtering Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 bg-white border border-zinc-200 rounded-2xl">
        {/* Search Bar */}
        <div className="relative w-full sm:max-w-xs">
          <SearchIcon className="w-4.5 h-4.5 text-zinc-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search by title, SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none transition-all"
          />
        </div>

        {/* Status Dropdowns */}
        <div className="flex gap-2 w-full sm:w-auto">
          {(["All", "Active", "Out of Stock", "Draft"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-4.5 h-11 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer ${
                statusFilter === filter
                  ? "bg-zinc-950 text-white border-zinc-950"
                  : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Main product data table */}
      <Table data={filteredProducts} columns={columns} />

      {/* Edit Product Modal */}
      {showEditModal && (
        <>
          <div
            onClick={() => !isSubmitting && setShowEditModal(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity"
          />

          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white border border-zinc-200 rounded-3xl p-6 shadow-2xl z-50 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-5">
              <h3 className="text-base font-extrabold text-zinc-955 text-left">
                Edit Store Product
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                disabled={isSubmitting}
                className="p-1 hover:bg-zinc-50 rounded-lg text-zinc-400 hover:text-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-4 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="edit_name" className="text-xs font-bold text-zinc-500">
                      Product Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="edit_name"
                      type="text"
                      placeholder="e.g. Wireless Headphone Pro"
                      value={editProductForm.name}
                      onChange={(e) => setEditProductForm((prev) => ({ ...prev, name: e.target.value }))}
                      disabled={isSubmitting}
                      className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label htmlFor="edit_sku" className="text-xs font-bold text-zinc-500">
                        SKU (Stock Keeping Unit)
                      </label>
                      <button
                        type="button"
                        onClick={handleAutoGenerateSku}
                        disabled={isSubmitting}
                        className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 disabled:text-zinc-400 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        ✨ Auto Generate
                      </button>
                    </div>
                    <input
                      id="edit_sku"
                      type="text"
                      placeholder="e.g. ELEC-982-AS"
                      value={editProductForm.sku}
                      onChange={(e) => setEditProductForm((prev) => ({ ...prev, sku: e.target.value }))}
                      disabled={isSubmitting}
                      className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="edit_category" className="text-xs font-bold text-zinc-500">
                      Product Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="edit_category"
                      value={editProductForm.category}
                      onChange={(e) => setEditProductForm((prev) => ({ ...prev, category: e.target.value }))}
                      disabled={isSubmitting}
                      className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label htmlFor="edit_price" className="text-xs font-bold text-zinc-500">
                        Price ($) <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="edit_price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={editProductForm.price}
                        onChange={(e) => setEditProductForm((prev) => ({ ...prev, price: e.target.value }))}
                        disabled={isSubmitting}
                        className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="edit_compareAtPrice" className="text-xs font-bold text-zinc-500">
                        Compare At ($)
                      </label>
                      <input
                        id="edit_compareAtPrice"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={editProductForm.compareAtPrice}
                        onChange={(e) => setEditProductForm((prev) => ({ ...prev, compareAtPrice: e.target.value }))}
                        disabled={isSubmitting}
                        className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="edit_stock" className="text-xs font-bold text-zinc-500">
                      Stock Level <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="edit_stock"
                      type="number"
                      placeholder="0"
                      value={editProductForm.stock}
                      onChange={(e) => setEditProductForm((prev) => ({ ...prev, stock: e.target.value }))}
                      disabled={isSubmitting}
                      className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500">Product Image</label>
                    <div className="space-y-3">
                      {imagePreview ? (
                        <div className="relative aspect-video rounded-xl border border-zinc-200 overflow-hidden group w-full h-24">
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <label className="px-3 py-1.5 bg-white text-zinc-900 rounded-lg text-[10px] font-bold cursor-pointer hover:bg-zinc-50 shadow-xs">
                              Replace Image
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                disabled={isSubmitting}
                              />
                            </label>
                          </div>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 hover:border-indigo-600 rounded-2xl py-6 cursor-pointer bg-zinc-50 transition-colors w-full h-24">
                          <svg className="w-6 h-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <span className="text-[10px] font-bold text-zinc-500 mt-2">Upload Product Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            disabled={isSubmitting}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label htmlFor="edit_description" className="text-xs font-bold text-zinc-500">
                        Product Description
                      </label>
                      <button
                        type="button"
                        onClick={handleGenerateDescription}
                        disabled={isGeneratingDesc || isSubmitting}
                        className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 disabled:text-zinc-400 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        {isGeneratingDesc ? "⏳ Writing..." : "✨ AI Generate"}
                      </button>
                    </div>
                    <textarea
                      id="edit_description"
                      rows={3}
                      placeholder="Enter description..."
                      value={editProductForm.description}
                      onChange={(e) => setEditProductForm((prev) => ({ ...prev, description: e.target.value }))}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none resize-none disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label htmlFor="edit_color" className="text-xs font-bold text-zinc-500">
                        Colors (comma sep.)
                      </label>
                      <input
                        id="edit_color"
                        type="text"
                        placeholder="Red, Blue..."
                        value={editProductForm.color}
                        onChange={(e) => setEditProductForm((prev) => ({ ...prev, color: e.target.value }))}
                        disabled={isSubmitting}
                        className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none disabled:opacity-60"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="edit_sizes" className="text-xs font-bold text-zinc-500">
                        Sizes (comma sep.)
                      </label>
                      <input
                        id="edit_sizes"
                        type="text"
                        placeholder="S, M, L..."
                        value={editProductForm.sizes}
                        onChange={(e) => setEditProductForm((prev) => ({ ...prev, sizes: e.target.value }))}
                        disabled={isSubmitting}
                        className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none disabled:opacity-60"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SEO Configurations */}
              <div className="border-t border-zinc-100 pt-4 mt-2">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xs font-extrabold text-zinc-900">SEO Meta Settings</h4>
                  <button
                    type="button"
                    onClick={handleGenerateSEO}
                    disabled={isGeneratingSeo || isSubmitting}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 disabled:text-zinc-400 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {isGeneratingSeo ? "⏳ Generating..." : "✨ AI Generate Tags & SEO"}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label htmlFor="edit_seoTitle" className="text-xs font-bold text-zinc-500">
                      SEO Title
                    </label>
                    <input
                      id="edit_seoTitle"
                      type="text"
                      placeholder="Meta title tags"
                      value={editProductForm.seoTitle}
                      onChange={(e) => setEditProductForm((prev) => ({ ...prev, seoTitle: e.target.value }))}
                      disabled={isSubmitting}
                      className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none disabled:opacity-60"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="edit_tags" className="text-xs font-bold text-zinc-500">
                      Search Tags (comma sep.)
                    </label>
                    <input
                      id="edit_tags"
                      type="text"
                      placeholder="e.g. phone, gadget"
                      value={editProductForm.tags}
                      onChange={(e) => setEditProductForm((prev) => ({ ...prev, tags: e.target.value }))}
                      disabled={isSubmitting}
                      className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none disabled:opacity-60"
                    />
                  </div>
                </div>
                <div className="space-y-1.5 mt-3">
                  <label htmlFor="edit_seoDescription" className="text-xs font-bold text-zinc-500">
                    SEO Description
                  </label>
                  <textarea
                    id="edit_seoDescription"
                    rows={2}
                    placeholder="Meta description for search listing..."
                    value={editProductForm.seoDescription}
                    onChange={(e) => setEditProductForm((prev) => ({ ...prev, seoDescription: e.target.value }))}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none resize-none disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Extra Enterprise Options */}
              <div className="border-t border-zinc-100 pt-4 space-y-4">
                <h4 className="text-xs font-bold text-zinc-950 uppercase tracking-wider text-left">Digital & Translation Settings</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Digital Toggle */}
                  <div className="space-y-1.5 flex flex-col justify-center">
                    <label className="flex items-center gap-2.5 text-xs font-bold text-zinc-700 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={editProductForm.is_digital}
                        onChange={(e) => setEditProductForm((prev) => ({ ...prev, is_digital: e.target.checked }))}
                        className="w-4.5 h-4.5 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      Is Digital Product
                    </label>
                  </div>

                  {/* Scheduled Publish */}
                  <div className="space-y-1.5">
                    <label htmlFor="edit_publish_at" className="text-xs font-bold text-zinc-500">
                      Scheduled Publishing
                    </label>
                    <input
                      id="edit_publish_at"
                      type="datetime-local"
                      value={editProductForm.publish_at}
                      onChange={(e) => setEditProductForm((prev) => ({ ...prev, publish_at: e.target.value }))}
                      className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none transition-all cursor-pointer"
                    />
                  </div>
                </div>

                {editProductForm.is_digital && (
                  <div className="space-y-4 pt-2 border-t border-zinc-100 animate-in fade-in duration-200">
                    <div className="space-y-1.5">
                      <label htmlFor="edit_digital_file_url" className="text-xs font-bold text-zinc-500">
                        Digital Product URL
                      </label>
                      <input
                        id="edit_digital_file_url"
                        type="url"
                        placeholder="https://example.com/file.zip"
                        value={editProductForm.digital_file_url}
                        onChange={(e) => setEditProductForm((prev) => ({ ...prev, digital_file_url: e.target.value }))}
                        className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label htmlFor="edit_license_keys" className="text-xs font-bold text-zinc-500">
                        Pre-generated License Keys (One per line)
                      </label>
                      <textarea
                        id="edit_license_keys"
                        rows={3}
                        placeholder="LIC-XXXX-XXXX"
                        value={editProductForm.license_keys}
                        onChange={(e) => setEditProductForm((prev) => ({ ...prev, license_keys: e.target.value }))}
                        className="w-full p-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none resize-none"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* Bengali Title */}
                  <div className="space-y-1.5">
                    <label htmlFor="edit_name_bn" className="text-xs font-bold text-zinc-500">
                      Product Title (Bengali)
                    </label>
                    <input
                      id="edit_name_bn"
                      type="text"
                      placeholder="বাংলা টাইটেল"
                      value={editProductForm.name_bn}
                      onChange={(e) => setEditProductForm((prev) => ({ ...prev, name_bn: e.target.value }))}
                      className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none"
                    />
                  </div>

                  {/* Bengali Description */}
                  <div className="space-y-1.5">
                    <label htmlFor="edit_description_bn" className="text-xs font-bold text-zinc-500">
                      Product Description (Bengali)
                    </label>
                    <textarea
                      id="edit_description_bn"
                      rows={2}
                      placeholder="বাংলা বিবরণ"
                      value={editProductForm.description_bn}
                      onChange={(e) => setEditProductForm((prev) => ({ ...prev, description_bn: e.target.value }))}
                      className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Maintenance Mode Alert inside Edit Modal */}
              {maintenanceMode && (
                <div className="p-4 bg-amber-50 border border-amber-200 text-amber-850 rounded-xl text-xs font-bold text-left flex items-start gap-2.5 animate-in fade-in slide-in-from-top-3 duration-250 mt-6">
                  <span className="text-sm shrink-0">⚠️</span>
                  <div>
                    <div className="font-extrabold text-amber-900">Product Updates Disabled</div>
                    <div className="font-semibold text-amber-750 mt-0.5 leading-relaxed">
                      You cannot update product details during platform maintenance. Write operations are temporarily locked.
                    </div>
                  </div>
                </div>
              )}

              {/* Actions Footer */}
              <div className="flex justify-end gap-3 border-t border-zinc-100 pt-5 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  disabled={isSubmitting}
                  className="px-5 h-11 border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || maintenanceMode}
                  className="px-6 h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/10"
                >
                  {isSubmitting ? "Saving Changes..." : maintenanceMode ? "Locked (Maintenance Mode)" : "Save Product Details"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Version History Modal */}
      {showHistoryModal && (
        <>
          <div
            onClick={() => setShowHistoryModal(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity"
          />

          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-white border border-zinc-200 rounded-3xl p-6 shadow-2xl z-50 animate-in zoom-in-95 duration-200 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-5">
              <div className="text-left">
                <h3 className="text-base font-extrabold text-zinc-955">
                  Product Version History
                </h3>
                <span className="text-[10px] font-bold text-zinc-400">
                  Logs for "{historyProduct?.name}"
                </span>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-1 hover:bg-zinc-50 rounded-lg text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {historyLogs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-xs font-semibold text-zinc-550">No edit history recorded for this product.</p>
              </div>
            ) : (
              <div className="space-y-4 text-left">
                {historyLogs.map((log: any) => (
                  <div key={log.id} className="p-4 bg-zinc-50 rounded-2xl border border-zinc-150 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-extrabold border border-indigo-100">
                        Version {log.version_number}
                      </span>
                      <span className="text-[10px] font-bold text-zinc-400">{log.created_at}</span>
                    </div>
                    <div className="text-xs font-bold text-zinc-700">
                      Modified by: <span className="text-zinc-955">{log.changed_by_name || "System/Merchant"}</span>
                    </div>
                    <div className="pt-2 border-t border-zinc-200/50 space-y-1.5">
                      {Object.keys(log.changes).map((field) => (
                        <div key={field} className="text-[11px] font-semibold text-zinc-650 flex flex-wrap gap-1 items-center">
                          <span className="px-1.5 py-0.5 bg-zinc-200 text-zinc-700 rounded text-[9px] uppercase font-bold font-mono">
                            {field.replace('_', ' ')}
                          </span>
                          <span className="line-through text-red-500 font-medium">
                            "{log.changes[field].old !== null ? String(log.changes[field].old) : 'None'}"
                          </span>
                          <span className="text-zinc-400">➔</span>
                          <span className="text-emerald-600 font-extrabold">
                            "{log.changes[field].new !== null ? String(log.changes[field].new) : 'None'}"
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex justify-end pt-4 mt-6 border-t border-zinc-100">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-5 h-10 bg-zinc-900 hover:bg-zinc-950 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Close History
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

