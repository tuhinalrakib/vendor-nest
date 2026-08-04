"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import api from "./api";
import { API_ENDPOINTS } from "@/constants/apiEnds";
import { useAuth } from "./AuthContext";

export interface CartItem {
  product_id: string;
  name: string;
  price: string;
  image: string | null;
  sku: string;
  quantity: number;
  seller_shop: string;
  seller_id?: string | null;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  isCartOpen: boolean;
  isLoading: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateCartQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  fetchCart: () => Promise<void>;
  clearCartState: () => void;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const clearCartState = () => {
    setCartItems([]);
    setCartCount(0);
    setIsCartOpen(false);
  };

  const clearCart = async () => {
    if (!user) {
      clearCartState();
      return;
    }
    setIsLoading(true);
    try {
      await api.delete(API_ENDPOINTS.CART);
      clearCartState();
    } catch (error) {
      console.error("Failed to clear cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCart = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const response = await api.get(API_ENDPOINTS.CART);
      setCartItems(response.data);
      
      // Calculate total count dynamically from items list
      const totalCount = response.data.reduce(
        (sum: number, item: CartItem) => sum + item.quantity,
        0
      );
      setCartCount(totalCount);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch cart automatically when user logging state changes
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      clearCartState();
    }
  }, [user]);

  const addToCart = async (productId: string, quantity = 1) => {
    if (!user) {
      throw new Error("Authentication required to add items to cart.");
    }
    setIsLoading(true);
    try {
      await api.post(API_ENDPOINTS.CART, {
        product_id: productId,
        quantity,
      });
      // Refresh cart details
      await fetchCart();
      // Automatically open the cart drawer to provide user feedback
      setIsCartOpen(true);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartQuantity = async (productId: string, quantity: number) => {
    if (!user) return;
    setIsLoading(true);
    try {
      await api.put(API_ENDPOINTS.CART, {
        product_id: productId,
        quantity,
      });
      await fetchCart();
    } catch (error) {
      console.error("Failed to update cart quantity:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) return;
    setIsLoading(true);
    try {
      await api.delete(API_ENDPOINTS.CART, {
        data: { product_id: productId },
      });
      await fetchCart();
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        isCartOpen,
        isLoading,
        setIsCartOpen,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        fetchCart,
        clearCartState,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
