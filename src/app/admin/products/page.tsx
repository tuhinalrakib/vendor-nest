"use client";

import React, { useState, useEffect } from "react";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_HOST || "http://127.0.0.1:8000";
import Table from "@/components/tables";
import Image from "next/image";
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
  categoryId?: string;
  color?: string;
  sizes?: string;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<ModerationProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Approved" | "Pending Moderation" | "Flagged">("All");
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
    is_digital: false,
    digital_file_url: "",
    license_keys: "",
    publish_at: "",
    name_bn: "",
    description_bn: "",
  });

  const [isFeatured, setIsFeatured] = useState(false);
  const [isPopular, setIsPopular] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);

  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [isGeneratingSeo, setIsGeneratingSeo] = useState(false);
  const [isTranslatingDesc, setIsTranslatingDesc] = useState(false);
  const [isTranslatingTitle, setIsTranslatingTitle] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const translateText = async (text: string): Promise<string> => {
    if (!text || !text.trim()) return "";
    try {
      const response = await api.post("/api/ai/translate/", { text: text.trim(), target_lang: "bn" });
      return response.data.translated_text || "";
    } catch (err) {
      console.error("Translation error:", err);
      return "";
    }
  };

  const handleAutoTranslateDesc = async (textToTranslate?: string) => {
    const targetText = textToTranslate !== undefined ? textToTranslate : newProduct.description;
    if (!targetText || !targetText.trim()) return;

    setIsTranslatingDesc(true);
    try {
      const translated = await translateText(targetText);
      if (translated) {
        setNewProduct((prev) => ({ ...prev, description_bn: translated }));
      }
    } catch (err) {
      console.error("Failed to translate description to Bengali:", err);
    } finally {
      setIsTranslatingDesc(false);
    }
  };

  const handleAutoTranslateTitle = async (textToTranslate?: string) => {
    const targetText = textToTranslate !== undefined ? textToTranslate : newProduct.name;
    if (!targetText || !targetText.trim()) return;

    setIsTranslatingTitle(true);
    try {
      const translated = await translateText(targetText);
      if (translated) {
        setNewProduct((prev) => ({ ...prev, name_bn: translated }));
      }
    } catch (err) {
      console.error("Failed to translate title to Bengali:", err);
    } finally {
      setIsTranslatingTitle(false);
    }
  };

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
        is_digital: false,
        digital_file_url: "",
        license_keys: "",
        publish_at: "",
        name_bn: "",
        description_bn: "",
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
        categoryId: p.category || "",
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
      if (newProduct.is_digital) data.append("is_digital", "true");
      if (newProduct.digital_file_url) data.append("digital_file_url", newProduct.digital_file_url);
      if (newProduct.license_keys) data.append("license_keys", newProduct.license_keys);
      if (newProduct.publish_at) data.append("publish_at", newProduct.publish_at);
      if (newProduct.name_bn) data.append("name_bn", newProduct.name_bn);
      if (newProduct.description_bn) data.append("description_bn", newProduct.description_bn);
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
        is_digital: false,
        digital_file_url: "",
        license_keys: "",
        publish_at: "",
        name_bn: "",
        description_bn: "",
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
    Swal.fire({
      title: "Update Verification Status",
      text: `Current status: ${currentStatus}. Choose new approval state:`,
      icon: "question",
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonColor: "#10b981",
      denyButtonColor: "#f59e0b",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "🟢 Approve",
      denyButtonText: "⏳ Pending Moderation",
      cancelButtonText: "🔴 Reject / Flag",
    }).then(async (result) => {
      let endpoint = "";
      if (result.isConfirmed) {
        endpoint = `/api/products/${id}/approve/`;
      } else if (result.isDenied) {
        endpoint = `/api/products/${id}/set_pending/`;
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        endpoint = `/api/products/${id}/reject/`;
      } else {
        return;
      }

      try {
        Swal.fire({
          title: 'Updating status...',
          allowOutsideClick: false,
          didOpen: () => { Swal.showLoading(); }
        });
        await api.post(endpoint);
        Swal.close();
        Swal.fire("Updated", "Product verification status updated successfully.", "success");
        fetchProducts();
      } catch (err) {
        Swal.close();
        console.error("Status update failed:", err);
        Swal.fire("Error", "Could not update approval status.", "error");
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

  const countAll = products.length;
  const countApproved = products.filter((p) => p.status === "Approved").length;
  const countPending = products.filter((p) => p.status === "Pending Moderation").length;
  const countFlagged = products.filter((p) => p.status === "Flagged").length;

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sellerShop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "All" ? true : p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      header: "Product Details",
      className: "pl-4 pr-2 max-w-[180px]",
      render: (p: ModerationProduct) => (
        <div className="flex items-center gap-2.5 text-left min-w-0">
          <div className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-150 flex items-center justify-center overflow-hidden shrink-0 relative">
            {p.image ? (
              <Image
                src={p.image}
                alt={p.name}
                fill
                sizes="32px"
                className="object-cover"
              />
            ) : (
              <span className="text-[9px] font-extrabold text-zinc-400">IMG</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-zinc-950 leading-tight truncate" title={p.name}>{p.name}</h4>
            {p.sku && (
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[9px] font-mono font-bold text-zinc-500 bg-zinc-100 px-1 py-0.2 rounded truncate">{p.sku}</span>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      header: "Seller Shop",
      className: "px-2 max-w-[130px]",
      render: (p: ModerationProduct) => (
        <span className="text-zinc-700 font-bold text-xs truncate block" title={p.sellerShop}>{p.sellerShop}</span>
      ),
    },
    {
      header: "Category",
      className: "px-2 max-w-[130px]",
      render: (p: ModerationProduct) => (
        <span className="text-zinc-500 text-xs font-semibold truncate block" title={p.category}>{p.category}</span>
      ),
    },
    {
      header: "Price",
      className: "px-2 whitespace-nowrap",
      render: (p: ModerationProduct) => (
        <span className="text-zinc-950 font-extrabold text-xs whitespace-nowrap">${p.price.toFixed(2)}</span>
      ),
    },
    {
      header: "Stock",
      className: "px-2 whitespace-nowrap",
      render: (p: ModerationProduct) => (
        <span className="text-zinc-600 font-semibold text-xs whitespace-nowrap">{p.stock} units</span>
      ),
    },
    {
      header: "Status",
      className: "px-2 whitespace-nowrap",
      render: (p: ModerationProduct) => {
        const colors = {
          Approved: "bg-emerald-50 text-emerald-700 border-emerald-250 hover:bg-emerald-100",
          Flagged: "bg-red-50 text-red-700 border-red-250 hover:bg-red-100",
          "Pending Moderation": "bg-amber-50 text-amber-700 border-amber-250 hover:bg-amber-100",
        };
        return (
          <button
            onClick={() => handleToggleStatus(p.id, p.status)}
            title="Click to toggle status (Approve/Reject)"
            className={`px-2 py-0.5 rounded-full text-[11px] font-bold border cursor-pointer transition-colors whitespace-nowrap ${colors[p.status]}`}
          >
            {p.status}
          </button>
        );
      },
    },
    {
      header: "Actions",
      className: "text-right pr-4 pl-1 min-w-[90px]",
      render: (p: ModerationProduct) => (
        <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
          <button
            title="Edit Product"
            onClick={() => handleEdit(p)}
            className="p-1.5 hover:bg-indigo-50 rounded-lg text-indigo-600 border border-indigo-200 hover:border-indigo-300 transition-all cursor-pointer flex items-center justify-center shadow-2xs"
          >
            <EditIcon className="w-4 h-4" />
          </button>
          <button
            title="Delete Product"
            onClick={() => handleDelete(p.id)}
            className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 border border-red-200 hover:border-red-300 transition-all cursor-pointer flex items-center justify-center shadow-2xs"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const handleEdit = (product: ModerationProduct) => {
    setEditProductId(product.id);
    const catId = product.categoryId || categories.find(c => c.name === product.category)?.id || "";
    setNewProduct({
      name: product.name || "",
      sellerShop: product.sellerShop || "Platform Direct (Admin)",
      price: product.price?.toString() || "",
      compareAtPrice: product.compareAtPrice?.toString() || "",
      sku: product.sku || "",
      stock: product.stock?.toString() || "",
      status: product.status || "Approved",
      category: catId,
      description: product.description || "",
      color: product.color || "",
      sizes: product.sizes || "",
      seoTitle: product.seoTitle || "",
      seoDescription: product.seoDescription || "",
      is_digital: (product as any).is_digital || false,
      digital_file_url: (product as any).digital_file_url || "",
      license_keys: (product as any).license_keys || "",
      publish_at: (product as any).publish_at ? (product as any).publish_at.substring(0, 16) : "",
      name_bn: (product as any).name_bn || "",
      description_bn: (product as any).description_bn || "",
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
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-950">All Products & Catalog Management</h1>
          <p className="text-xs font-semibold text-zinc-400 mt-1">
            Manage, review, edit, approve, or remove product listings across all network sellers.
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

      <div className="flex flex-col gap-4 p-4 bg-white border border-zinc-200 rounded-2xl shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-xs">
            <SearchIcon className="w-4.5 h-4.5 text-zinc-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by title, seller, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none transition-all"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-100">
          <button
            onClick={() => setStatusFilter("All")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              statusFilter === "All"
                ? "bg-zinc-950 text-white shadow-xs"
                : "bg-zinc-50 text-zinc-600 hover:bg-zinc-100 border border-zinc-200"
            }`}
          >
            All Products
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              statusFilter === "All" ? "bg-zinc-800 text-zinc-200" : "bg-zinc-200 text-zinc-700"
            }`}>
              {countAll}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter("Approved")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              statusFilter === "Approved"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-zinc-50 text-emerald-700 hover:bg-emerald-50 border border-emerald-200"
            }`}
          >
            Approved
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              statusFilter === "Approved" ? "bg-emerald-700 text-emerald-100" : "bg-emerald-100 text-emerald-800"
            }`}>
              {countApproved}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter("Pending Moderation")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              statusFilter === "Pending Moderation"
                ? "bg-amber-500 text-white shadow-xs"
                : "bg-zinc-50 text-amber-700 hover:bg-amber-50 border border-amber-200"
            }`}
          >
            Pending Moderation
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              statusFilter === "Pending Moderation" ? "bg-amber-600 text-amber-100" : "bg-amber-100 text-amber-800"
            }`}>
              {countPending}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter("Flagged")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              statusFilter === "Flagged"
                ? "bg-red-600 text-white shadow-xs"
                : "bg-zinc-50 text-red-700 hover:bg-red-50 border border-red-200"
            }`}
          >
            Flagged / Rejected
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              statusFilter === "Flagged" ? "bg-red-700 text-red-100" : "bg-red-100 text-red-800"
            }`}>
              {countFlagged}
            </span>
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block">
        <Table data={filteredProducts} columns={columns} minWidth="w-full min-w-[720px]" />
      </div>

      {/* Mobile Responsive Card List View */}
      <div className="block sm:hidden space-y-3">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <div key={p.id} className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-xs space-y-3 text-left">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-150 flex items-center justify-center overflow-hidden shrink-0 relative">
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-[10px] font-extrabold text-zinc-400">IMG</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-zinc-950 leading-tight truncate">{p.name}</h4>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {p.sku && (
                      <span className="text-[9px] font-mono font-bold text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded">{p.sku}</span>
                    )}
                    <span className="text-[10px] font-semibold text-zinc-500">{p.category}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-zinc-100">
                <div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Seller Shop</span>
                  <span className="font-bold text-zinc-800 truncate block">{p.sellerShop}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Price & Stock</span>
                  <span className="font-extrabold text-zinc-950">${p.price.toFixed(2)}</span>
                  <span className="text-zinc-500 font-semibold ml-1">({p.stock} units)</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
                <div>
                  <button
                    onClick={() => handleToggleStatus(p.id, p.status)}
                    className={`px-2.5 py-1 rounded-full text-xs font-bold border cursor-pointer transition-colors ${
                      p.status === "Approved"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : p.status === "Flagged"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {p.status}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <EditIcon className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center bg-white border border-zinc-200 rounded-2xl text-zinc-400 text-sm font-medium">
            No records found
          </div>
        )}
      </div>

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
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            fill
                            sizes="(max-width: 768px) 100vw, 384px"
                            unoptimized
                            className="object-cover"
                          />
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

              {/* Digital Product Settings */}
              <div className="bg-zinc-50 border border-zinc-250 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Digital Product Settings</h4>
                  <label className="flex items-center gap-2 text-xs font-bold text-zinc-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={newProduct.is_digital}
                      onChange={(e) => setNewProduct((prev) => ({ ...prev, is_digital: e.target.checked }))}
                      disabled={isSubmitting}
                      className="w-4 h-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    Is Digital Product
                  </label>
                </div>

                {newProduct.is_digital && (
                  <div className="space-y-3 pt-2 border-t border-zinc-200 animate-in fade-in duration-200">
                    <div className="space-y-1.5">
                      <label htmlFor="digital_file_url" className="text-xs font-bold text-zinc-650">
                        Digital Product Download URL (ZIP, PDF, Software etc.)
                      </label>
                      <input
                        id="digital_file_url"
                        type="url"
                        placeholder="https://example.com/download.zip"
                        value={newProduct.digital_file_url}
                        onChange={(e) => setNewProduct((prev) => ({ ...prev, digital_file_url: e.target.value }))}
                        disabled={isSubmitting}
                        className="w-full h-9 px-3 bg-white border border-zinc-200 focus:border-indigo-650 rounded-lg text-xs font-semibold outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="license_keys" className="text-xs font-bold text-zinc-650">
                        Pre-generated License Keys (One per line)
                      </label>
                      <textarea
                        id="license_keys"
                        rows={3}
                        placeholder="LIC-XXXX-XXXX&#10;LIC-YYYY-YYYY"
                        value={newProduct.license_keys}
                        onChange={(e) => setNewProduct((prev) => ({ ...prev, license_keys: e.target.value }))}
                        disabled={isSubmitting}
                        className="w-full p-3 bg-white border border-zinc-200 focus:border-indigo-650 rounded-lg text-xs font-semibold outline-none resize-none disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Translation & Scheduled Publishing */}
              <div className="bg-zinc-50 border border-zinc-250 rounded-2xl p-4 space-y-3">
                <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Translation & Scheduled Publishing</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label htmlFor="name_bn" className="text-xs font-bold text-zinc-650">
                        Product Title (Bengali / বাংলা)
                      </label>
                      <button
                        type="button"
                        onClick={() => handleAutoTranslateTitle()}
                        disabled={isTranslatingTitle || isSubmitting}
                        className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 disabled:text-zinc-400 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        {isTranslatingTitle ? (
                          <>
                            <span className="w-3.5 h-3.5 border border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
                            Translating...
                          </>
                        ) : (
                          "✨ Auto-Translate"
                        )}
                      </button>
                    </div>
                    <input
                      id="name_bn"
                      type="text"
                      placeholder="যেমন: ওয়্যারলেস হেডফোন প্র"
                      value={newProduct.name_bn}
                      onChange={(e) => setNewProduct((prev) => ({ ...prev, name_bn: e.target.value }))}
                      disabled={isSubmitting}
                      className="w-full h-9 px-3 bg-white border border-zinc-200 focus:border-indigo-650 rounded-lg text-xs font-semibold outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="publish_at" className="text-xs font-bold text-zinc-650">
                      Scheduled Publishing Date & Time
                    </label>
                    <input
                      id="publish_at"
                      type="datetime-local"
                      value={newProduct.publish_at}
                      onChange={(e) => setNewProduct((prev) => ({ ...prev, publish_at: e.target.value }))}
                      disabled={isSubmitting}
                      className="w-full h-9 px-3 bg-white border border-zinc-200 focus:border-indigo-650 rounded-lg text-xs font-semibold outline-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label htmlFor="description_bn" className="text-xs font-bold text-zinc-650">
                      Product Description (Bengali / বাংলা)
                    </label>
                    <button
                      type="button"
                      onClick={() => handleAutoTranslateDesc()}
                      disabled={isTranslatingDesc || isSubmitting}
                      className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 disabled:text-zinc-400 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {isTranslatingDesc ? (
                        <>
                          <span className="w-3.5 h-3.5 border border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
                          Translating...
                        </>
                      ) : (
                        "✨ Auto-Translate to Bengali"
                      )}
                    </button>
                  </div>
                  <textarea
                    id="description_bn"
                    rows={2}
                    placeholder="বাংলা ভাষায় প্রোডাক্টের বিস্তারিত বিবরণ (Auto-translated in Bengali)..."
                    value={newProduct.description_bn}
                    onChange={(e) => setNewProduct((prev) => ({ ...prev, description_bn: e.target.value }))}
                    disabled={isSubmitting}
                    className="w-full p-3 bg-white border border-zinc-200 focus:border-indigo-650 rounded-lg text-xs font-semibold outline-none resize-none disabled:opacity-60 disabled:cursor-not-allowed"
                  />
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
                  disabled={isSubmitting || isTranslatingTitle || isTranslatingDesc || isGeneratingDesc || isGeneratingSeo}
                  className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/10 transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {editProductId ? "Updating..." : "Adding..."}
                    </>
                  ) : (isTranslatingTitle || isTranslatingDesc || isGeneratingDesc || isGeneratingSeo) ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Translating / AI Working...
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
