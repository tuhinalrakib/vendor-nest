"use client";

import React, { useState, useEffect } from "react";
import Table from "@/components/tables";
import { SearchIcon, TrashIcon } from "@/components/icons";
import Swal from "sweetalert2";
import api from "@/lib/api";
import DynamicLoading from "@/components/dynamicLoading/DynamicLoading";

interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: "customer" | "seller" | "admin";
  dateJoined: string;
  status: "Active" | "Banned";
}

export default function AdminUsers() {
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "customer" | "seller" | "admin">("all");

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/api/users/");
      const mapped = response.data.map((u: any) => ({
        id: u.id,
        name: u.full_name || u.username || u.email.split("@")[0],
        email: u.email,
        role: u.role,
        dateJoined: new Date(u.date_joined).toLocaleDateString("en-CA"),
        status: u.is_active ? "Active" : "Banned",
      }));
      setUsers(mapped);
    } catch (err: any) {
      console.error("Failed to fetch users:", err);
      Swal.fire({
        title: "Error",
        text: "Could not load users from backend.",
        icon: "error",
        confirmButtonColor: "#4f46e5",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = (userId: string, currentStatus: PlatformUser["status"]) => {
    const nextStatus = currentStatus === "Active" ? "Banned" : "Active";
    Swal.fire({
      title: `${nextStatus} User?`,
      text: `Are you sure you want to change this user's status to ${nextStatus}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: nextStatus === "Banned" ? "#ef4444" : "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Yes, ${nextStatus}`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.patch(`/api/users/${userId}/`, {
            is_active: nextStatus === "Active",
          });
          setUsers((prev) =>
            prev.map((u) => (u.id === userId ? { ...u, status: nextStatus } : u))
          );
          Swal.fire({
            title: "Status Changed",
            text: `User status has been set to ${nextStatus}.`,
            icon: "success",
            confirmButtonColor: "#4f46e5",
          });
        } catch (err: any) {
          console.error(err);
          Swal.fire({
            title: "Error",
            text: "Failed to update user status on backend.",
            icon: "error",
            confirmButtonColor: "#4f46e5",
          });
        }
      }
    });
  };

  const handleChangeRole = (userId: string, newRole: PlatformUser["role"]) => {
    Swal.fire({
      title: "Update Role?",
      text: `Change this user's platform role to ${newRole}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, update",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.patch(`/api/users/${userId}/`, {
            role: newRole,
          });
          setUsers((prev) =>
            prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
          );
          Swal.fire({
            title: "Role Updated",
            text: `User is now assigned as a ${newRole}.`,
            icon: "success",
            confirmButtonColor: "#4f46e5",
          });
        } catch (err: any) {
          console.error(err);
          Swal.fire({
            title: "Error",
            text: "Failed to update user role on backend.",
            icon: "error",
            confirmButtonColor: "#4f46e5",
          });
        }
      }
    });
  };

  const handleDeleteUser = (userId: string, name: string) => {
    Swal.fire({
      title: "Delete User?",
      text: `Are you sure you want to permanently delete user "${name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/api/users/${userId}/`);
          setUsers((prev) => prev.filter((u) => u.id !== userId));
          Swal.fire({
            title: "Deleted!",
            text: `User "${name}" has been deleted.`,
            icon: "success",
            confirmButtonColor: "#4f46e5",
          });
        } catch (err: any) {
          console.error(err);
          Swal.fire({
            title: "Deletion Failed",
            text: "Could not delete user from backend.",
            icon: "error",
            confirmButtonColor: "#4f46e5",
          });
        }
      }
    });
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const columns = [
    {
      header: "Name",
      render: (u: PlatformUser) => (
        <span className="text-zinc-950 font-bold text-left">{u.name}</span>
      ),
    },
    {
      header: "Email",
      render: (u: PlatformUser) => (
        <span className="text-xs text-zinc-550 font-semibold text-left">{u.email}</span>
      ),
    },
    {
      header: "Joined On",
      render: (u: PlatformUser) => <span className="text-xs text-zinc-450 font-semibold">{u.dateJoined}</span>,
    },
    {
      header: "Platform Role",
      render: (u: PlatformUser) => (
        <select
          value={u.role}
          onChange={(e) => handleChangeRole(u.id, e.target.value as PlatformUser["role"])}
          className="h-9 px-3 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 rounded-lg text-xs font-bold cursor-pointer"
        >
          <option value="customer">Customer</option>
          <option value="seller">Seller</option>
          <option value="admin">Admin</option>
        </select>
      ),
    },
    {
      header: "Account Status",
      render: (u: PlatformUser) => {
        const isBanned = u.status === "Banned";
        return (
          <button
            onClick={() => handleToggleStatus(u.id, u.status)}
            className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase transition-all duration-200 cursor-pointer ${
              isBanned
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
            }`}
          >
            {u.status}
          </button>
        );
      },
    },
    {
      header: "Actions",
      render: (u: PlatformUser) => (
        <button
          onClick={() => handleDeleteUser(u.id, u.name)}
          className="p-1.5 hover:bg-red-50 rounded-lg text-zinc-400 hover:text-red-655 transition-colors cursor-pointer"
        >
          <TrashIcon className="w-4.5 h-4.5" />
        </button>
      ),
    },
  ];

  if(isLoading) return <DynamicLoading loadingText="Loading users data..."/>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-left">
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-950">Platform Users</h1>
        <p className="text-xs font-semibold text-zinc-400 mt-1">
          Perform administrative actions, update system roles, and revoke accounts.
        </p>
      </div>

      {/* Filter panel */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 bg-white border border-zinc-200 rounded-2xl">
        <div className="relative w-full sm:max-w-xs">
          <SearchIcon className="w-4.5 h-4.5 text-zinc-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search by name, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-zinc-50 border border-zinc-200 focus:border-indigo-650 focus:bg-white rounded-xl text-sm font-semibold outline-none transition-all"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          {(["all", "customer", "seller", "admin"] as const).map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-4 h-11 rounded-xl text-xs font-bold border capitalize transition-all duration-200 cursor-pointer ${
                roleFilter === role
                  ? "bg-zinc-950 text-white border-zinc-950"
                  : "bg-white text-zinc-650 border-zinc-200 hover:bg-zinc-50"
              }`}
            >
              {role}s
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      { (
        <Table data={filteredUsers} columns={columns} />
      )}
    </div>
  );
}
