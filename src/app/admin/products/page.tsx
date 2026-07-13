"use client";

import React, { useState, useEffect } from "react";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_HOST || "http://127.0.0.1:8000";
import Table from "@/components/tables";
import { SearchIcon, TrashIcon, AddIcon, EditIcon } from "@/components/icons";
import Swal from "sweetalert2";
import api from "@/lib/api";
import Loading from "@/app/loading";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import DynamicLoading from "@/components/dynamicLoading/DynamicLoading";

interface ModerationProduct {
  id: string;
  name: string;
  sellerShop: string;
  price: number;
  stock: number;
  status: "Approved" | "Flagged" | "Pending Moderation";
  image?: string;
  description?: string;
  compareAtPrice?: number;
  sku?: string;
  category?: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<ModerationProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    sellerShop: "Platform Direct (Admin)",
    price: "",
    compareAtPrice: "",
    sku: "",
    stock: "",
    status: "Approved" as ModerationProduct["status"],
    category: "",
    description: "",
    color: "",
    sizes: "",
    seoTitle: "",
    seoDescription: "",
  });

  const [isFeatured, setIsFeatured] = useState(false);
  const [isPopular, setIsPopular] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);

  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [isGeneratingSeo, setIsGeneratingSeo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const selectedCat = categories.find(c => c.id === newProduct.category);
    const catName = selectedCat ? selectedCat.name : "";
    if (!catName || !newProduct.price) {
      Swal.fire({
        title: "Missing Fields",
        text: "Please select a Category and enter a Price first to generate a SKU.",
        icon: "warning",
        confirmButtonColor: "#4f46e5",
      });
      return;
    }
    const suggestedSku = generateSKUSuggestion(catName, newProduct.price);
    setNewProduct(prev => ({ ...prev, sku: suggestedSku }));
  };

  useEffect(() => {
    if (!showAddModal) {
      setEditProductId(null);
      setNewProduct({
        name: "",
        sellerShop: "Platform Direct (Admin)",
        price: "",
        compareAtPrice: "",
        sku: "",
        stock: "",
        status: "Approved",
        category: "",
        description: "",
        color: "",
        sizes: "",
        seoTitle: "",
        seoDescription: "",
      });
      setIsFeatured(false);
      setIsPopular(false);
      setIsNewArrival(false);
    }
  }, [showAddModal]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const catRes = await api.get("/api/categories/");
      const catMap: { [id: string]: string } = {};
      catRes.data.forEach((c: any) => {
        catMap[c.id] = c.name;
      });
      setCategories(catRes.data);

      const prodRes = await api.get("/api/products/");
      const mapped = prodRes.data.map((p: any) => ({
        id: p.id,
        name: p.name,
        sellerShop: p.seller_shop || "Platform Direct (Admin)",
        price: parseFloat(p.price) || 0,
        stock: p.stock || 0,
        status: p.approval_status === "approved" 
          ? "Approved" 
          : p.approval_status === "rejected" 
            ? "Flagged" 
            : "Pending Moderation" as ModerationProduct["status"],
        image: p.image || undefined,
        description: p.description || "",
        compareAtPrice: p.compare_at_price ? parseFloat(p.compare_at_price) : undefined,
        sku: p.sku || "",
        category: p.category ? (catMap[p.category] || "Unknown") : "Uncategorized",
      }));
      setProducts(mapped);
    } catch (err: any) {
      console.error("Failed to load products/categories:", err);
      Swal.fire({
        title: "Error",
        text: "Could not load catalogue from backend.",
        icon: "error",
        confirmButtonColor: "#4f46e5",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);



  const handleGenerateDescription = async () => {
    if (!newProduct.name) {
      Swal.fire({
        title: "Product Name Required",
        text: "Please enter a product name first to generate a description.",
        icon: "warning",
        confirmButtonColor: "#4f46e5",
      });
      return;
    }
    setIsGeneratingDesc(true);
    try {
      const response = await api.post("/api/ai/generate-description/", {
        name: newProduct.name,
        category: newProduct.category,
      });
      const data = response.data;
      setNewProduct((prev) => ({ ...prev, description: data.content }));
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
    if (!newProduct.name) {
      Swal.fire({
        title: "Product Name Required",
        text: "Please enter a product name first to generate SEO tags.",
        icon: "warning",
        confirmButtonColor: "#4f46e5",
      });
      return;
    }
    setIsGeneratingSeo(true);
    try {
      const response = await api.post("/api/ai/generate-seo/", {
        name: newProduct.name,
        category: newProduct.category,
        description: newProduct.description,
      });
      const data = response.data;
      setNewProduct((prev) => ({
        ...prev,
        seoTitle: data.meta_title,
        seoDescription: data.meta_description,
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
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      Swal.fire({
        title: "Missing Fields",
        text: "Please enter product name and price.",
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
      data.append("name", newProduct.name);
      data.append("price", newProduct.price);
      if (newProduct.category) data.append("category", newProduct.category);
      if (newProduct.sku) data.append("sku", newProduct.sku);
      if (newProduct.compareAtPrice) data.append("compare_at_price", newProduct.compareAtPrice);
      if (newProduct.stock) data.append("stock", newProduct.stock);
      if (newProduct.description) data.append("description", newProduct.description);
      if (newProduct.color) data.append("color", newProduct.color);
      if (newProduct.sizes) data.append("sizes", newProduct.sizes);
      if (newProduct.seoTitle) data.append("seo_title", newProduct.seoTitle);
      if (newProduct.seoDescription) data.append("seo_description", newProduct.seoDescription);
      if (imageUrl) {
        data.append("image", imageUrl);
      }

      // Collect product badges into tags
      const badges: string[] = [];
      if (isFeatured) badges.push("featured");
      if (isPopular) badges.push("popular");
      if (isNewArrival) badges.push("new_arrival");
      if (badges.length > 0) {
        data.append("tags", badges.join(", "));
      }

      if (editProductId) {
        await api.patch(`/api/products/${editProductId}/`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        Swal.fire({
          title: "Product Updated",
          text: `Successfully updated product "${newProduct.name}".`,
          icon: "success",
          confirmButtonColor: "#4f46e5",
        });
      } else {
        await api.post("/api/products/", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        Swal.fire({
          title: "Product Added",
          text: `Successfully added product "${newProduct.name}" to the platform catalog.`,
          icon: "success",
          confirmButtonColor: "#4f46e5",
        });
      }

      setShowAddModal(false);
      setImagePreview(null);
      setImageFile(null);
      setIsFeatured(false);
      setIsPopular(false);
      setIsNewArrival(false);
      setNewProduct({
        name: "",
        sellerShop: "Platform Direct (Admin)",
        price: "",
        compareAtPrice: "",
        sku: "",
        stock: "",
        status: "Approved",
        category: "",
        description: "",
        color: "",
        sizes: "",
        seoTitle: "",
        seoDescription: "",
      });

      fetchProducts();
    } catch (err: any) {
      console.error("Failed to create product:", err);
      const errMsg = err.response?.data?.detail || err.response?.data?.message || "Failed to add product to catalog.";
      Swal.fire({
        title: "Creation Failed",
        text: errMsg,
        icon: "error",
        confirmButtonColor: "#4f46e5",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: ModerationProduct["status"]) => {
    const nextAction = currentStatus === "Approved" ? "reject" : "approve";
    const actionLabel = nextAction === "reject" ? "Reject/Flag" : "Approve";
    
    Swal.fire({
      title: `${actionLabel} Product?`,
      text: `Are you sure you want to set this product listing to ${nextAction === "reject" ? "Rejected" : "Approved"}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: nextAction === "reject" ? "#ef4444" : "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Yes, ${actionLabel}`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          Swal.fire({
            title: 'Updating status...',
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading(); }
          });
          await api.post(`/api/products/${id}/${nextAction}/`);
          Swal.close();
          Swal.fire("Updated", `Product verification status is now set to ${nextAction === "reject" ? "Rejected" : "Approved"}.`, "success");
          fetchProducts();
        } catch (err) {
          Swal.close();
          console.error("Status toggle failed:", err);
          Swal.fire("Error", "Could not update approval status.", "error");
        }
      }
    });
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Remove Listing?",
      text: "Are you sure you want to delete this product listing from the platform?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/api/products/${id}/`);
          setProducts((prev) => prev.filter((p) => p.id !== id));
          Swal.fire({
            title: "Deleted!",
            text: "Product listing has been removed.",
            icon: "success",
            confirmButtonColor: "#4f46e5",
          });
        } catch (err: any) {
          console.error("Failed to delete product:", err);
          Swal.fire({
            title: "Deletion Failed",
            text: "Could not remove listing from backend.",
            icon: "error",
            confirmButtonColor: "#4f46e5",
          });
        }
      }
    });
  };


  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sellerShop.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      header: "Product Details",
      render: (p: ModerationProduct) => (
        <div className="flex items-center gap-3.5 text-left">
          <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-150 flex items-center justify-center overflow-hidden shrink-0">
            {p.image ? (
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[10px] font-extrabold text-zinc-400">IMG</span>
            )}
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-950 leading-tight">{p.name}</h4>
            {p.sku && (
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-mono font-bold text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded">{p.sku}</span>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      header: "Seller Shop",
      render: (p: ModerationProduct) => (
        <span className="text-zinc-700 font-bold">{p.sellerShop}</span>
      ),
    },
    {
      header: "Category",
      render: (p: ModerationProduct) => (
        <span className="text-zinc-500 text-xs font-semibold">{p.category}</span>
      ),
    },
    {
      header: "Price",
      render: (p: ModerationProduct) => (
        <span className="text-zinc-950 font-extrabold">${p.price.toFixed(2)}</span>
      ),
    },
    {
      header: "Stock",
      render: (p: ModerationProduct) => (
        <span className="text-zinc-550 font-semibold">{p.stock} units</span>
      ),
    },
    {
      header: "Status",
      render: (p: ModerationProduct) => {
        const colors = {
          Approved: "bg-emerald-50 text-emerald-700 border-emerald-250",
          Flagged: "bg-red-50 text-red-700 border-red-250",
          "Pending Moderation": "bg-amber-50 text-amber-700 border-amber-250",
        };
        return (
          <button
            onClick={() => handleToggleStatus(p.id, p.status)}
            className={`px-2.5 py-1 rounded-full text-xs font-bold border cursor-pointer transition-colors ${colors[p.status]}`}
          >
            {p.status}
          </button>
        );
      },
    },
    {
      header: "Actions",
      render: (p: ModerationProduct) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(p)}
            className="p-1.5 hover:bg-indigo-50 rounded-lg text-zinc-450 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            <EditIcon className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={() => handleDelete(p.id)}
            className="p-1.5 hover:bg-red-50 rounded-lg text-zinc-450 hover:text-red-655 transition-colors cursor-pointer"
          >
            <TrashIcon className="w-4.5 h-4.5" />
          </button>
        </div>
      ),
    },
  ];

  const handleEdit = (product: ModerationProduct) => {
    setEditProductId(product.id);
    const selectedCat = categories.find(c => c.name === product.category);
    setNewProduct({
      name: product.name || "",
      sellerShop: product.sellerShop || "Platform Direct (Admin)",
      price: product.price?.toString() || "",
      compareAtPrice: product.compareAtPrice?.toString() || "",
      sku: product.sku || "",
      stock: product.stock?.toString() || "",
      status: product.status || "Approved",
      category: selectedCat ? selectedCat.id : "",
      description: product.description || "",
      color: (product as any).color || "",
      sizes: (product as any).sizes || "",
      seoTitle: (product as any).seoTitle || "",
      seoDescription: (product as any).seoDescription || "",
    });
    setImagePreview(product.image || null);
    setImageFile(null);
    setShowAddModal(true);
  };

  if(isLoading) return <DynamicLoading loadingText="Loading Products..."/>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-950">Moderate Catalog Listings</h1>
          <p className="text-xs font-semibold text-zinc-400 mt-1">
            Review, flag, and remove listings violating policies across the entire network.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="h-11 px-5 bg-zinc-950 hover:bg-zinc-900 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer text-nowrap shrink-0"
        >
          <AddIcon className="w-4.5 h-4.5" />
          Add Platform Product
        </button>
      </div>

      <div className="flex p-4 bg-white border border-zinc-200 rounded-2xl">
        <div className="relative w-full sm:max-w-xs">
          <SearchIcon className="w-4.5 h-4.5 text-zinc-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search by title, seller..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none transition-all"
          />
        </div>
      </div>

      <Table data={filteredProducts} columns={columns} />

      {showAddModal && (
        <>
          <div
            onClick={() => !isSubmitting && setShowAddModal(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-xs z-45"
          />

          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white border border-zinc-200 rounded-3xl p-6 shadow-2xl z-50 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-5">
              <h3 className="text-base font-extrabold text-zinc-950 text-left">
                {editProductId ? "Edit Platform Product" : "Add Platform Product"}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                disabled={isSubmitting}
                className="p-1 hover:bg-zinc-100 rounded-lg text-zinc-455 hover:text-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-xs font-bold text-zinc-650">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="e.g. Wireless Headphones"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))}
                      disabled={isSubmitting}
                      className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label htmlFor="sku" className="text-xs font-bold text-zinc-650">
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
                      id="sku"
                      type="text"
                      placeholder="e.g. WH-109"
                      value={newProduct.sku}
                      onChange={(e) => setNewProduct((prev) => ({ ...prev, sku: e.target.value }))}
                      disabled={isSubmitting}
                      className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="sellerShop" className="text-xs font-bold text-zinc-650">
                      Seller Shop
                    </label>
                    <input
                      id="sellerShop"
                      type="text"
                      value={newProduct.sellerShop}
                      className="w-full h-11 px-4 bg-zinc-100 border border-zinc-200 rounded-xl text-sm font-semibold text-zinc-500 outline-none cursor-not-allowed"
                      readOnly
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="category" className="text-xs font-bold text-zinc-650">
                      Category
                    </label>
                    <select
                      id="category"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct((prev) => ({ ...prev, category: e.target.value }))}
                      disabled={isSubmitting}
                      className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label htmlFor="price" className="text-xs font-bold text-zinc-650">
                        Price ($) <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct((prev) => ({ ...prev, price: e.target.value }))}
                        disabled={isSubmitting}
                        className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="compareAtPrice" className="text-xs font-bold text-zinc-650">
                        Compare ($)
                      </label>                      <input
                        id="compareAtPrice"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={newProduct.compareAtPrice}
                        onChange={(e) => setNewProduct((prev) => ({ ...prev, compareAtPrice: e.target.value }))}
                        disabled={isSubmitting}
                        className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label htmlFor="stock" className="text-xs font-bold text-zinc-650">
                        Stock Qty
                      </label>
                      <input
                        id="stock"
                        type="number"
                        placeholder="0"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct((prev) => ({ ...prev, stock: e.target.value }))}
                        disabled={isSubmitting}
                        className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="status" className="text-xs font-bold text-zinc-650">
                        Status
                      </label>
                      <select
                        id="status"
                        value={newProduct.status}
                        onChange={(e) => setNewProduct((prev) => ({ ...prev, status: e.target.value as ModerationProduct["status"] }))}
                        disabled={isSubmitting}
                        className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <option value="Approved">Approved</option>
                        <option value="Pending Moderation">Pending Moderation</option>
                        <option value="Flagged">Flagged</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-650">Product Image</label>
                    <div className="space-y-3">
                      {imagePreview ? (
                        <div className="relative aspect-video rounded-xl border border-zinc-200 overflow-hidden group w-full h-24">
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                          <div className={`absolute inset-0 bg-black/40 opacity-0 transition-opacity flex items-center justify-center ${isSubmitting ? "" : "group-hover:opacity-100"}`}>
                            <button
                              type="button"
                              onClick={() => setImagePreview(null)}
                              disabled={isSubmitting}
                              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg text-[10px] font-bold uppercase transition-colors disabled:cursor-not-allowed"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className={`flex flex-col items-center justify-center w-full h-24 rounded-xl border-2 border-dashed border-zinc-200 transition-all ${isSubmitting ? "opacity-50 cursor-not-allowed pointer-events-none" : "hover:border-indigo-600 hover:bg-zinc-50 cursor-pointer"}`}>
                          <svg className="w-6 h-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                          </svg>
                          <span className="text-[11px] font-bold text-zinc-700 mt-1">Upload Product Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            disabled={isSubmitting}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Options (Optional) */}
              <div className="bg-zinc-50 border border-zinc-250 rounded-2xl p-4 space-y-3">
                <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Product Options (Optional)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="color" className="text-xs font-bold text-zinc-600">Available Colors</label>
                    <input
                      id="color"
                      type="text"
                      placeholder="e.g. Red, Blue, Black"
                      value={newProduct.color}
                      onChange={(e) => setNewProduct((prev) => ({ ...prev, color: e.target.value }))}
                      disabled={isSubmitting}
                      className="w-full h-9 px-3 bg-white border border-zinc-200 focus:border-indigo-650 rounded-lg text-xs font-semibold outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="sizes" className="text-xs font-bold text-zinc-650">Available Sizes</label>
                    <input
                      id="sizes"
                      type="text"
                      placeholder="e.g. S, M, L, XL"
                      value={newProduct.sizes}
                      onChange={(e) => setNewProduct((prev) => ({ ...prev, sizes: e.target.value }))}
                      disabled={isSubmitting}
                      className="w-full h-9 px-3 bg-white border border-zinc-200 focus:border-indigo-650 rounded-lg text-xs font-semibold outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
              {/* Product Badges */}
              <div className="bg-zinc-50 border border-zinc-250 rounded-2xl p-4 space-y-2">
                <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Product Badges / Features</h4>
                <div className="flex flex-wrap gap-6 pt-1">
                  <label className={`flex items-center gap-2.5 text-xs font-bold text-zinc-700 select-none ${isSubmitting ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}>
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      disabled={isSubmitting}
                      className="w-4.5 h-4.5 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    Featured Product
                  </label>
                  <label className={`flex items-center gap-2.5 text-xs font-bold text-zinc-700 select-none ${isSubmitting ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}>
                    <input
                      type="checkbox"
                      checked={isPopular}
                      onChange={(e) => setIsPopular(e.target.checked)}
                      disabled={isSubmitting}
                      className="w-4.5 h-4.5 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    Popular Product
                  </label>
                  <label className={`flex items-center gap-2.5 text-xs font-bold text-zinc-700 select-none ${isSubmitting ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}>
                    <input
                      type="checkbox"
                      checked={isNewArrival}
                      onChange={(e) => setIsNewArrival(e.target.checked)}
                      disabled={isSubmitting}
                      className="w-4.5 h-4.5 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    New Arrival Product
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="description" className="text-xs font-bold text-zinc-650">
                    Product Description
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateDescription}
                    disabled={isGeneratingDesc || isSubmitting}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 disabled:text-zinc-400 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {isGeneratingDesc ? (
                      <>
                        <span className="w-3.5 h-3.5 border border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
                        Generating...
                      </>
                    ) : (
                      "✨ Generate with AI"
                    )}
                  </button>
                </div>
                <textarea
                  id="description"
                  rows={3}
                  placeholder="Enter detailed description..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct((prev) => ({ ...prev, description: e.target.value }))}
                  disabled={isSubmitting || isGeneratingDesc}
                  className="w-full p-3 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none resize-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              {/* SEO & Search Tags Section */}
              <div className="space-y-4 pt-4 border-t border-zinc-150">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-zinc-950 uppercase tracking-wider">Search Optimization (SEO) & Tags</h3>
                  <button
                    type="button"
                    onClick={handleGenerateSEO}
                    disabled={isGeneratingSeo || isSubmitting}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 disabled:text-zinc-400 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {isGeneratingSeo ? (
                      <>
                        <span className="w-3.5 h-3.5 border border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
                        Generating...
                      </>
                    ) : (
                      "✨ Generate SEO with AI"
                    )}
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="seoTitle" className="text-xs font-bold text-zinc-650">
                    SEO Meta Title
                  </label>
                  <input
                    id="seoTitle"
                    type="text"
                    placeholder="Enter SEO meta title..."
                    value={newProduct.seoTitle}
                    onChange={(e) => setNewProduct((prev) => ({ ...prev, seoTitle: e.target.value }))}
                    disabled={isSubmitting}
                    className="w-full h-11 px-3 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="seoDescription" className="text-xs font-bold text-zinc-650">
                    SEO Meta Description
                  </label>
                  <textarea
                    id="seoDescription"
                    rows={2}
                    placeholder="Enter SEO meta description..."
                    value={newProduct.seoDescription}
                    onChange={(e) => setNewProduct((prev) => ({ ...prev, seoDescription: e.target.value }))}
                    disabled={isSubmitting || isGeneratingSeo}
                    className="w-full p-3 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none resize-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-zinc-150">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  disabled={isSubmitting}
                  className="flex-1 h-11 border border-zinc-200 hover:bg-zinc-50 text-zinc-700 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/10 transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {editProductId ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    editProductId ? "Update Product" : "Add Product"
                  )}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
