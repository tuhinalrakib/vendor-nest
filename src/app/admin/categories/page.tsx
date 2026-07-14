"use client";

import React, { useState, useEffect } from "react";
import Table from "@/components/tables";
import Image from "next/image";
import { AddIcon, TrashIcon, EditIcon } from "@/components/icons";
import Swal from "sweetalert2";
import api from "@/lib/api";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import DynamicLoading from "@/components/dynamicLoading/DynamicLoading";

interface PlatformCategory {
  id: string;
  name: string;
  slug: string;
  productCount: number;
  image?: string;
  description?: string;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<PlatformCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [isGeneratingEditDescription, setIsGeneratingEditDescription] = useState(false);

  const [editingCategory, setEditingCategory] = useState<PlatformCategory | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/api/categories/");
      setCategories(response.data);
    } catch (err: any) {
      console.error("Failed to fetch categories:", err);
      Swal.fire({
        title: "Error",
        text: "Could not load categories from backend.",
        icon: "error",
        confirmButtonColor: "#4f46e5",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewName(value);
    // Auto-generate slug
    setNewSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditName(value);
    setEditSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
  };

  const handleEditClick = (category: PlatformCategory) => {
    setEditingCategory(category);
    setEditName(category.name);
    setEditSlug(category.slug);
    setEditDescription(category.description || "");
    setEditImagePreview(category.image || null);
    setEditImageFile(null);
  };

  const handleGenerateDescription = async () => {
    if (!newName.trim()) {
      Swal.fire({
        title: "Name Required",
        text: "Please enter a category name first to generate a description.",
        icon: "warning",
        confirmButtonColor: "#4f46e5",
      });
      return;
    }

    try {
      setIsGeneratingDescription(true);
      const response = await api.post("/api/ai/generate-category-description/", {
        name: newName,
      });
      if (response.data?.description) {
        setNewDescription(response.data.description);
      } else if (response.data?.error) {
        throw new Error(response.data.error);
      }
    } catch (err: any) {
      console.error("Failed to generate category description:", err);
      Swal.fire({
        title: "Generation Failed",
        text: err.response?.data?.error || "Could not generate description with AI.",
        icon: "error",
        confirmButtonColor: "#4f46e5",
      });
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleGenerateEditDescription = async () => {
    if (!editName.trim()) {
      Swal.fire({
        title: "Name Required",
        text: "Please enter a category name first to generate a description.",
        icon: "warning",
        confirmButtonColor: "#4f46e5",
      });
      return;
    }

    try {
      setIsGeneratingEditDescription(true);
      const response = await api.post("/api/ai/generate-category-description/", {
        name: editName,
      });
      if (response.data?.description) {
        setEditDescription(response.data.description);
      } else if (response.data?.error) {
        throw new Error(response.data.error);
      }
    } catch (err: any) {
      console.error("Failed to generate category description:", err);
      Swal.fire({
        title: "Generation Failed",
        text: err.response?.data?.error || "Could not generate description with AI.",
        icon: "error",
        confirmButtonColor: "#4f46e5",
      });
    } finally {
      setIsGeneratingEditDescription(false);
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    if (!editName || !editSlug) {
      Swal.fire({
        title: "Missing Name",
        text: "Please enter a category name.",
        icon: "error",
        confirmButtonColor: "#4f46e5",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      let imageUrl = "";
      if (editImageFile) {
        imageUrl = await uploadImageToCloudinary(editImageFile);
      }

      const formData = new FormData();
      formData.append("name", editName);
      formData.append("slug", editSlug);
      if (editDescription) {
        formData.append("description", editDescription);
      }
      if (imageUrl) {
        formData.append("image", imageUrl);
      }

      const response = await api.put(`/api/categories/${editingCategory.id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const updated = response.data;
      setCategories((prev) =>
        prev.map((c) => (c.id === editingCategory.id ? updated : c))
      );
      setEditingCategory(null);

      Swal.fire({
        title: "Category Updated!",
        text: `Category "${updated.name}" has been updated successfully.`,
        icon: "success",
        confirmButtonColor: "#4f46e5",
      });
    } catch (err: any) {
      console.error(err);
      const errMsg = err.response?.data?.name?.[0] || err.response?.data?.slug?.[0] || "Failed to update category on backend.";
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

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newSlug) {
      Swal.fire({
        title: "Missing Name",
        text: "Please enter a category name.",
        icon: "error",
        confirmButtonColor: "#4f46e5",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
      }

      const formData = new FormData();
      formData.append("name", newName);
      formData.append("slug", newSlug);
      if (newDescription) {
        formData.append("description", newDescription);
      }
      if (imageUrl) {
        formData.append("image", imageUrl);
      }

      const response = await api.post("/api/categories/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const created = response.data;
      setCategories((prev) => [...prev, created]);
      setShowAddModal(false);
      setNewName("");
      setNewSlug("");
      setNewDescription("");
      setImagePreview(null);
      setImageFile(null);

      Swal.fire({
        title: "Category Created!",
        text: `Category "${created.name}" has been created successfully.`,
        icon: "success",
        confirmButtonColor: "#4f46e5",
      });
    } catch (err: any) {
      console.error(err);
      const errMsg = err.response?.data?.name?.[0] || err.response?.data?.slug?.[0] || "Failed to create category on backend.";
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

  const handleDelete = (id: string, name: string) => {
    Swal.fire({
      title: "Delete Category?",
      text: `Are you sure you want to delete the category "${name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/api/categories/${id}/`);
          setCategories((prev) => prev.filter((c) => c.id !== id));
          Swal.fire({
            title: "Deleted!",
            text: `Category "${name}" has been deleted.`,
            icon: "success",
            confirmButtonColor: "#4f46e5",
          });
        } catch (err: any) {
          console.error(err);
          Swal.fire({
            title: "Deletion Failed",
            text: "Could not delete category from backend.",
            icon: "error",
            confirmButtonColor: "#4f46e5",
          });
        }
      }
    });
  };

  const columns = [
    {
      header: "Category Name",
      render: (c: PlatformCategory) => (
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-150 flex items-center justify-center overflow-hidden shrink-0 relative">
            {c.image ? (
              <Image
                src={c.image}
                alt={c.name}
                fill
                sizes="40px"
                className="object-cover"
              />
            ) : (
              <span className="text-[9px] font-extrabold text-zinc-400">IMG</span>
            )}
          </div>
          <span className="text-zinc-950 font-bold">{c.name}</span>
        </div>
      ),
    },
    {
      header: "URL Slug",
      render: (c: PlatformCategory) => <span className="font-mono text-xs text-zinc-500">{c.slug}</span>,
    },
    {
      header: "Products Linked",
      render: (c: PlatformCategory) => (
        <span className="text-zinc-900 font-bold">{c.productCount} products</span>
      ),
    },
    {
      header: "Actions",
      render: (c: PlatformCategory) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEditClick(c)}
            className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
          >
            <EditIcon className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={() => handleDelete(c.id, c.name)}
            className="p-1.5 hover:bg-red-50 rounded-lg text-zinc-400 hover:text-red-655 transition-colors cursor-pointer"
          >
            <TrashIcon className="w-4.5 h-4.5" />
          </button>
        </div>
      ),
    },
  ];

  if(isLoading) return <DynamicLoading loadingText="Loading Categories data..."/>

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-950">Store Categories</h1>
          <p className="text-xs font-semibold text-zinc-400 mt-1">
            Build and moderate category trees and product classifications across the SaaS platform.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="h-11 px-5 bg-zinc-950 hover:bg-zinc-900 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
        >
          <AddIcon className="w-4.5 h-4.5" />
          Add Category
        </button>
      </div>

      {/* Categories Table */}
      <Table data={categories} columns={columns} />

      {/* Create Modal */}
      {showAddModal && (
        <>
          <div
            onClick={() => !isSubmitting && setShowAddModal(false)}
            className={`fixed inset-0 bg-black/30 backdrop-blur-xs z-45 ${isSubmitting ? "cursor-not-allowed" : "cursor-pointer"}`}
          />

          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white border border-zinc-200 rounded-3xl p-6 shadow-2xl z-50 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-5">
              <h3 className="text-base font-extrabold text-zinc-950 text-left">Add Platform Category</h3>
              <button
                onClick={() => setShowAddModal(false)}
                disabled={isSubmitting}
                className="p-1 hover:bg-zinc-100 rounded-lg text-zinc-450 hover:text-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-xs font-bold text-zinc-650">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="e.g. Beauty & Health"
                  value={newName}
                  onChange={handleNameChange}
                  disabled={isSubmitting}
                  className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="slug" className="text-xs font-bold text-zinc-650">
                  Category URL Slug
                </label>
                <input
                  id="slug"
                  type="text"
                  placeholder="beauty-health"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                  required
                />
              </div>

              {/* Category Image Uploader */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-650">Category Image</label>
                <div className="space-y-3">
                  {imagePreview ? (
                    <div className="relative aspect-video rounded-xl border border-zinc-200 overflow-hidden group w-full h-32">
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
                          disabled={isSubmitting}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-bold uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className={`flex flex-col items-center justify-center w-full h-24 rounded-xl border-2 border-dashed border-zinc-200 transition-all ${isSubmitting ? "opacity-60 cursor-not-allowed bg-zinc-50" : "hover:border-indigo-600 hover:bg-zinc-50 cursor-pointer"}`}>
                      <svg className="w-6 h-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-[11px] font-bold text-zinc-700 mt-1">Upload Category Image</span>
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

              {/* Category Description */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="description" className="text-xs font-bold text-zinc-650">
                    Category Description
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateDescription}
                    disabled={isGeneratingDescription || isSubmitting || !newName.trim()}
                    className="flex items-center gap-1 text-[11px] font-extrabold text-indigo-600 hover:text-indigo-700 disabled:text-zinc-400 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                  >
                    {isGeneratingDescription ? (
                      <>
                        <svg className="animate-spin h-3.5 w-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Generating...
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z" />
                          <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5Z" />
                          <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1Z" />
                        </svg>
                        Generate with AI
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  id="description"
                  rows={3}
                  placeholder="Enter category description..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  disabled={isSubmitting || isGeneratingDescription}
                  className="w-full p-3 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none resize-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              <div className="flex gap-3 pt-4">
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
                      Creating...
                    </>
                  ) : (
                    "Create Category"
                  )}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Edit Modal */}
      {editingCategory && (
        <>
          <div
            onClick={() => !isSubmitting && setEditingCategory(null)}
            className={`fixed inset-0 bg-black/30 backdrop-blur-xs z-45 ${isSubmitting ? "cursor-not-allowed" : "cursor-pointer"}`}
          />

          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white border border-zinc-200 rounded-3xl p-6 shadow-2xl z-50 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-5">
              <h3 className="text-base font-extrabold text-zinc-950 text-left">Edit Platform Category</h3>
              <button
                onClick={() => setEditingCategory(null)}
                disabled={isSubmitting}
                className="p-1 hover:bg-zinc-100 rounded-lg text-zinc-450 hover:text-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdateCategory} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label htmlFor="edit-name" className="text-xs font-bold text-zinc-650">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="edit-name"
                  type="text"
                  placeholder="e.g. Beauty & Health"
                  value={editName}
                  onChange={handleEditNameChange}
                  disabled={isSubmitting}
                  className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="edit-slug" className="text-xs font-bold text-zinc-650">
                  Category URL Slug
                </label>
                <input
                  id="edit-slug"
                  type="text"
                  placeholder="beauty-health"
                  value={editSlug}
                  onChange={(e) => setEditSlug(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                  required
                />
              </div>

              {/* Category Image Uploader */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-650">Category Image</label>
                <div className="space-y-3">
                  {editImagePreview ? (
                    <div className="relative aspect-video rounded-xl border border-zinc-200 overflow-hidden group w-full h-32">
                      <Image
                        src={editImagePreview}
                        alt="Preview"
                        fill
                        sizes="(max-width: 768px) 100vw, 384px"
                        unoptimized
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => setEditImagePreview(null)}
                          disabled={isSubmitting}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-bold uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className={`flex flex-col items-center justify-center w-full h-24 rounded-xl border-2 border-dashed border-zinc-200 transition-all ${isSubmitting ? "opacity-60 cursor-not-allowed bg-zinc-50" : "hover:border-indigo-600 hover:bg-zinc-50 cursor-pointer"}`}>
                      <svg className="w-6 h-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-[11px] font-bold text-zinc-700 mt-1">Upload Category Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleEditImageChange}
                        disabled={isSubmitting}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Category Description */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="edit-description" className="text-xs font-bold text-zinc-650">
                    Category Description
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateEditDescription}
                    disabled={isGeneratingEditDescription || isSubmitting || !editName.trim()}
                    className="flex items-center gap-1 text-[11px] font-extrabold text-indigo-600 hover:text-indigo-700 disabled:text-zinc-400 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                  >
                    {isGeneratingEditDescription ? (
                      <>
                        <svg className="animate-spin h-3.5 w-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Generating...
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z" />
                          <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5Z" />
                          <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1Z" />
                        </svg>
                        Generate with AI
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  id="edit-description"
                  rows={3}
                  placeholder="Enter category description..."
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  disabled={isSubmitting || isGeneratingEditDescription}
                  className="w-full p-3 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none resize-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
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
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
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
