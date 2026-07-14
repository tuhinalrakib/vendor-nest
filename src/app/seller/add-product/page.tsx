"use client";

import React, { useState, useEffect } from "react";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_HOST || "http://127.0.0.1:8000";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2";
import api from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/apiEnds";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { useAuth } from "@/lib/AuthContext";

export default function SellerAddProduct() {
  const router = useRouter();
  const { maintenanceMode } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    compareAtPrice: "",
    category: "",
    stock: "",
    description: "",
    seoTitle: "",
    seoDescription: "",
    tags: "",
    color: "",
    sizes: "",
    is_digital: false,
    digital_file_url: "",
    license_keys: "",
    publish_at: "",
    name_bn: "",
    description_bn: "",
  });

  const [storeName, setStoreName] = useState("Loading...");
  const [sellerStatus, setSellerStatus] = useState<string>("approved");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPopular, setIsPopular] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(API_ENDPOINTS.SELLER_PROFILE);
        const data = response.data;
        if (data) {
          if (data.shop_name) setStoreName(data.shop_name);
          if (data.status) {
            setSellerStatus(data.status);
            if (data.status !== "approved") {
              Swal.fire({
                title: "Approval Required",
                text: "Your seller account is pending admin approval. You cannot add products at this time. Please make sure your Store and Tax information is complete in Settings.",
                icon: "warning",
                confirmButtonText: "Go to Settings",
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
          }

          // Plan limits enforcement: Starter max 15 products
          if (data.plan === "starter") {
            try {
              const productsResponse = await api.get("/api/products/");
              const productCount = productsResponse.data.length;
              if (productCount >= 15) {
                Swal.fire({
                  title: "Product Limit Reached",
                  text: "You have reached the maximum limit of 15 products allowed on the Starter plan. Please upgrade to Growth or Scale Enterprise to add more products.",
                  icon: "warning",
                  confirmButtonText: "Upgrade Subscription Plan",
                  showCancelButton: true,
                  cancelButtonText: "Go to Catalogue",
                  confirmButtonColor: "#4f46e5",
                  cancelButtonColor: "#6b7280",
                }).then((result) => {
                  if (result.isConfirmed) {
                    router.push("/seller/settings");
                  } else {
                    router.push("/seller/products");
                  }
                });
              }
            } catch (err) {
              console.error("Failed to check product counts:", err);
            }
          }
        } else {
          setStoreName("My Seller Shop");
        }
      } catch (error) {
        console.error("Failed to fetch seller profile:", error);
        setStoreName("My Seller Shop");
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/categories/");
        setCategories(response.data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchProfile();
    fetchCategories();
  }, [router]);

  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [isGeneratingSeo, setIsGeneratingSeo] = useState(false);
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
    const selectedCat = categories.find(c => c.id === formData.category);
    const catName = selectedCat ? selectedCat.name : "";
    if (!catName || !formData.price) {
      Swal.fire({
        title: "Missing Fields",
        text: "Please select a Category and enter a Price first to generate a SKU.",
        icon: "warning",
        confirmButtonColor: "#4f46e5",
      });
      return;
    }
    const suggestedSku = generateSKUSuggestion(catName, formData.price);
    setFormData(prev => ({ ...prev, sku: suggestedSku }));
  };

  const handleGenerateDescription = async () => {
    if (!formData.name) {
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
        name: formData.name,
        category: formData.category,
      });
      const data = response.data;
      setFormData((prev) => ({ ...prev, description: data.content }));
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
    if (!formData.name) {
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
        name: formData.name,
        category: formData.category,
        description: formData.description,
      });
      const data = response.data;
      setFormData((prev) => ({
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
      const errorMsg = err.response?.data?.error || err.message || "Failed to connect to AI server.";
      Swal.fire({
        title: "AI Generation Failed",
        text: errorMsg,
        icon: "error",
        confirmButtonColor: "#4f46e5",
      });
    } finally {
      setIsGeneratingSeo(false);
    }
  };

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) {
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
      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("category", formData.category);
      if (formData.sku) data.append("sku", formData.sku);
      if (formData.compareAtPrice) data.append("compare_at_price", formData.compareAtPrice);
      if (formData.stock) data.append("stock", formData.stock);
      if (formData.description) data.append("description", formData.description);
      if (formData.seoTitle) data.append("seo_title", formData.seoTitle);
      if (formData.seoDescription) data.append("seo_description", formData.seoDescription);
      if (formData.color) data.append("color", formData.color);
      if (formData.sizes) data.append("sizes", formData.sizes);
      if (imageUrl) {
        data.append("image", imageUrl);
      }
      
      data.append("is_digital", formData.is_digital ? "true" : "false");
      data.append("digital_file_url", formData.digital_file_url);
      data.append("license_keys", formData.license_keys);
      if (formData.publish_at) {
        data.append("publish_at", new Date(formData.publish_at).toISOString());
      }
      data.append("name_bn", formData.name_bn);
      data.append("description_bn", formData.description_bn);

      // Collect product badges into tags
      const badges: string[] = [];
      if (isFeatured) badges.push("featured");
      if (isPopular) badges.push("popular");
      if (isNewArrival) badges.push("new_arrival");
      if (formData.tags) {
        formData.tags.split(",").forEach(t => {
          const val = t.trim();
          if (val && !badges.includes(val)) badges.push(val);
        });
      }
      if (badges.length > 0) {
        data.append("tags", badges.join(", "));
      }

      await api.post("/api/products/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setIsSuccess(true);
    } catch (err: any) {
      console.error("Failed to add product:", err);
      const errMsg = err.response?.data?.detail || err.response?.data?.message || "Failed to add product to the catalog.";
      Swal.fire({
        title: "Submission Failed",
        text: errMsg,
        icon: "error",
        confirmButtonColor: "#4f46e5",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      sku: "",
      price: "",
      compareAtPrice: "",
      category: "",
      stock: "",
      description: "",
      seoTitle: "",
      seoDescription: "",
      tags: "",
      color: "",
      sizes: "",
      is_digital: false,
      digital_file_url: "",
      license_keys: "",
      publish_at: "",
      name_bn: "",
      description_bn: "",
    });
    setImagePreview(null);
    setImageFile(null);
    setIsFeatured(false);
    setIsPopular(false);
    setIsNewArrival(false);
    setIsSuccess(false);
  };


  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white border border-zinc-200 rounded-3xl text-center shadow-lg animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100 shadow-sm">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-extrabold text-zinc-950">Product Added Successfully!</h2>
        <p className="text-xs font-semibold text-zinc-400 mt-2 leading-relaxed">
          "{formData.name}" has been registered in your warehouse inventory and is ready to buy on your storefront.
        </p>

        <div className="mt-8 space-y-3">
          <button
            onClick={() => router.push("/seller/products")}
            className="w-full h-11 bg-zinc-950 hover:bg-zinc-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            View Product Catalogue
          </button>
          <button
            onClick={resetForm}
            className="w-full h-11 border border-zinc-200 hover:bg-zinc-50 text-zinc-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Add Another Product
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Title */}
      <div className="text-left">
        <h1 className="text-2xl font-extrabold text-zinc-950 tracking-tight">Add New Product</h1>
        <p className="text-xs font-semibold text-zinc-400 mt-1">
          Upload products directly to your multi-vendor catalogue by filling out the details below.
        </p>
      </div>

      {/* Product Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Form Settings */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-5 text-left">
            <h3 className="text-sm font-bold text-zinc-950">General Information</h3>

            {/* Title */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-bold text-zinc-600">
                Product Title <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="e.g. Wireless Noise Cancelling Headphones"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-600 focus:bg-white rounded-xl text-sm font-semibold outline-none transition-all"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="description" className="text-xs font-bold text-zinc-600">
                  Description
                </label>
                <button
                  type="button"
                  onClick={handleGenerateDescription}
                  disabled={isGeneratingDesc}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer transition-colors"
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
                name="description"
                rows={5}
                placeholder="Provide a detailed description of features, specifications, and layout..."
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-600 focus:bg-white rounded-xl text-sm font-semibold outline-none transition-all resize-none"
              />
            </div>

            {/* Product Badges */}
            <div className="space-y-2 pt-4 border-t border-zinc-150">
              <label className="text-xs font-bold text-zinc-600">Product Badges</label>
              <div className="flex flex-wrap gap-6 pt-1">
                <label className="flex items-center gap-2.5 text-xs font-bold text-zinc-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4.5 h-4.5 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  Featured Product
                </label>
                <label className="flex items-center gap-2.5 text-xs font-bold text-zinc-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isPopular}
                    onChange={(e) => setIsPopular(e.target.checked)}
                    className="w-4.5 h-4.5 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  Popular Product
                </label>
                <label className="flex items-center gap-2.5 text-xs font-bold text-zinc-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isNewArrival}
                    onChange={(e) => setIsNewArrival(e.target.checked)}
                    className="w-4.5 h-4.5 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  New Arrival Product
                </label>
              </div>
            </div>
          </div>

          {/* Digital Product Settings */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-5 text-left">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-950">Digital Product Settings</h3>
              <label className="flex items-center gap-2.5 text-xs font-bold text-zinc-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.is_digital}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_digital: e.target.checked }))}
                  className="w-4.5 h-4.5 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                Is Digital Product
              </label>
            </div>
            
            {formData.is_digital && (
              <div className="space-y-4 pt-2 border-t border-zinc-100 animate-in fade-in duration-200">
                <div className="space-y-1.5">
                  <label htmlFor="digital_file_url" className="text-xs font-bold text-zinc-600">
                    Digital Product Download URL (ZIP, PDF, Software etc.)
                  </label>
                  <input
                    id="digital_file_url"
                    name="digital_file_url"
                    type="url"
                    placeholder="https://example.com/download.zip"
                    value={formData.digital_file_url}
                    onChange={handleInputChange}
                    className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-600 focus:bg-white rounded-xl text-sm font-semibold outline-none transition-all"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label htmlFor="license_keys" className="text-xs font-bold text-zinc-600">
                    Pre-generated License Keys (One per line)
                  </label>
                  <textarea
                    id="license_keys"
                    name="license_keys"
                    rows={4}
                    placeholder="LIC-XXXX-XXXX&#10;LIC-YYYY-YYYY"
                    value={formData.license_keys}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-600 focus:bg-white rounded-xl text-sm font-semibold outline-none transition-all resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Translation & Scheduled Publishing */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-5 text-left">
            <h3 className="text-sm font-bold text-zinc-955">Translation & Scheduled Publishing</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="name_bn" className="text-xs font-bold text-zinc-600">
                  Product Title (Bengali / বাংলা)
                </label>
                <input
                  id="name_bn"
                  name="name_bn"
                  type="text"
                  placeholder="যেমন: ওয়্যারলেস হেডফোন প্র"
                  value={formData.name_bn}
                  onChange={handleInputChange}
                  className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-600 focus:bg-white rounded-xl text-sm font-semibold outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="publish_at" className="text-xs font-bold text-zinc-600">
                  Scheduled Publishing Date & Time
                </label>
                <input
                  id="publish_at"
                  name="publish_at"
                  type="datetime-local"
                  value={formData.publish_at}
                  onChange={handleInputChange}
                  className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none transition-all cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="description_bn" className="text-xs font-bold text-zinc-600">
                Product Description (Bengali / বাংলা)
              </label>
              <textarea
                id="description_bn"
                name="description_bn"
                rows={3}
                placeholder="বাংলা ভাষায় প্রোডাক্টের বিস্তারিত বিবরণ লিখুন..."
                value={formData.description_bn}
                onChange={handleInputChange}
                className="w-full p-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-600 focus:bg-white rounded-xl text-sm font-semibold outline-none transition-all resize-none"
              />
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-5 text-left">
            <h3 className="text-sm font-bold text-zinc-950">Pricing & Stock</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Price */}
              <div className="space-y-1.5">
                <label htmlFor="price" className="text-xs font-bold text-zinc-600">
                  Sale Price ($) <span className="text-red-500">*</span>
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-600 focus:bg-white rounded-xl text-sm font-semibold outline-none transition-all"
                  required
                />
              </div>

              {/* Compare at Price */}
              <div className="space-y-1.5">
                <label htmlFor="compareAtPrice" className="text-xs font-bold text-zinc-600">
                  Compare-at Price ($)
                </label>
                <input
                  id="compareAtPrice"
                  name="compareAtPrice"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.compareAtPrice}
                  onChange={handleInputChange}
                  className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-600 focus:bg-white rounded-xl text-sm font-semibold outline-none transition-all"
                />
              </div>

              {/* SKU */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="sku" className="text-xs font-bold text-zinc-600">
                    SKU (Stock Keeping Unit)
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoGenerateSku}
                    className="text-[11px] font-bold text-indigo-650 hover:text-indigo-700 transition-colors cursor-pointer"
                  >
                    ✨ Auto Generate
                  </button>
                </div>
                <input
                  id="sku"
                  name="sku"
                  type="text"
                  placeholder="WHP-8890"
                  value={formData.sku}
                  onChange={(e) => setFormData((prev) => ({ ...prev, sku: e.target.value }))}
                  className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-600 focus:bg-white rounded-xl text-sm font-semibold outline-none transition-all"
                />
              </div>

              {/* Stock Quantity */}
              <div className="space-y-1.5">
                <label htmlFor="stock" className="text-xs font-bold text-zinc-600">
                  Warehouse Stock Quantity
                </label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  placeholder="0"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-600 focus:bg-white rounded-xl text-sm font-semibold outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Product Options (Optional) */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-5 text-left">
            <h3 className="text-sm font-bold text-zinc-950">Product Options (Optional)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Color */}
              <div className="space-y-1.5">
                <label htmlFor="color" className="text-xs font-bold text-zinc-600">
                  Available Colors
                </label>
                <input
                  id="color"
                  name="color"
                  type="text"
                  placeholder="e.g. Red, Blue, Black"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-600 focus:bg-white rounded-xl text-sm font-semibold outline-none transition-all"
                />
              </div>

              {/* Sizes */}
              <div className="space-y-1.5">
                <label htmlFor="sizes" className="text-xs font-bold text-zinc-600">
                  Available Sizes
                </label>
                <input
                  id="sizes"
                  name="sizes"
                  type="text"
                  placeholder="e.g. S, M, L, XL"
                  value={formData.sizes}
                  onChange={handleInputChange}
                  className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-600 focus:bg-white rounded-xl text-sm font-semibold outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* SEO & Search Tags Section */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-5 text-left">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-zinc-950">Search Optimization (SEO) & Tags</h3>
              <button
                type="button"
                onClick={handleGenerateSEO}
                disabled={isGeneratingSeo}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer transition-colors"
              >
                {isGeneratingSeo ? (
                  <>
                    <span className="w-3.5 h-3.5 border border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
                    Generating...
                  </>
                ) : (
                  "✨ Auto-Generate SEO & Tags"
                )}
              </button>
            </div>

            <div className="space-y-4">
              {/* Meta Title */}
              <div className="space-y-1.5">
                <label htmlFor="seoTitle" className="text-xs font-bold text-zinc-600">
                  Meta Title
                </label>
                <input
                  id="seoTitle"
                  name="seoTitle"
                  type="text"
                  placeholder="e.g. Premium Noise Cancelling Headphones - Shop Online"
                  value={formData.seoTitle}
                  onChange={handleInputChange}
                  className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-600 focus:bg-white rounded-xl text-sm font-semibold outline-none transition-all"
                />
              </div>

              {/* Meta Description */}
              <div className="space-y-1.5">
                <label htmlFor="seoDescription" className="text-xs font-bold text-zinc-600">
                  Meta Description
                </label>
                <textarea
                  id="seoDescription"
                  name="seoDescription"
                  rows={3}
                  placeholder="Provide a search snippet summarizing the product (max 160 characters)..."
                  value={formData.seoDescription}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-600 focus:bg-white rounded-xl text-sm font-semibold outline-none transition-all resize-none"
                />
              </div>

              {/* Search Tags */}
              <div className="space-y-1.5">
                <label htmlFor="tags" className="text-xs font-bold text-zinc-600">
                  Search Tags / Keywords
                </label>
                <input
                  id="tags"
                  name="tags"
                  type="text"
                  placeholder="comma separated, e.g. headphones, wireless, sound"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-600 focus:bg-white rounded-xl text-sm font-semibold outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Settings */}
        <div className="space-y-6">
          {/* Category selection */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 text-left space-y-4">
            <h3 className="text-sm font-bold text-zinc-950">Shop & Category</h3>
            
            {/* Seller Shop (Read Only) */}
            <div className="space-y-1.5">
              <label htmlFor="sellerShop" className="text-xs font-bold text-zinc-600">
                Seller Shop
              </label>
              <input
                id="sellerShop"
                type="text"
                value={storeName}
                className="w-full h-11 px-4 bg-zinc-100 border border-zinc-200 rounded-xl text-sm font-semibold text-zinc-500 outline-none cursor-not-allowed"
                readOnly
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="category" className="text-xs font-bold text-zinc-600">
                Product Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-600 focus:bg-white rounded-xl text-sm font-semibold outline-none transition-all appearance-none cursor-pointer"
                required
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image Uploader */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 text-left space-y-4">
            <h3 className="text-sm font-bold text-zinc-950">Product Images</h3>
            <div className="space-y-3">
              {imagePreview ? (
                <div className="relative aspect-square rounded-xl border border-zinc-200 overflow-hidden group">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    sizes="(max-width: 768px) 100vw, 384px"
                    unoptimized
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-[10px] font-bold uppercase transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-zinc-200 hover:border-indigo-600 hover:bg-zinc-50 cursor-pointer transition-all">
                  <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-xs font-bold text-zinc-700 mt-2">Upload Image</span>
                  <span className="text-[10px] text-zinc-400 mt-1">PNG, JPG formats supported</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Maintenance warning */}
          {maintenanceMode && (
            <div className="p-4 bg-amber-50 border border-amber-200 text-amber-850 rounded-xl text-xs font-bold text-left flex items-start gap-2.5 animate-in fade-in slide-in-from-top-3 duration-250">
              <span className="text-sm shrink-0">⚠️</span>
              <div>
                <div className="font-extrabold text-amber-900">Product Creation Disabled</div>
                <div className="font-semibold text-amber-750 mt-0.5 leading-relaxed">
                  You cannot add or edit products during platform maintenance. Write operations are temporarily locked.
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push("/seller/products")}
              className="flex-1 h-11 border border-zinc-200 hover:bg-zinc-50 text-zinc-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || sellerStatus !== "approved" || maintenanceMode}
              className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-300 disabled:text-zinc-500 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/10 flex items-center justify-center transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : sellerStatus !== "approved" ? (
                "Locked (Pending Approval)"
              ) : maintenanceMode ? (
                "Maintenance Mode Active"
              ) : (
                "Save Product"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
