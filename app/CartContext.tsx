"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/lib/data";

interface CartItem extends Product {
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
    currency: "USD" | "INR" | "PKR";
    setCurrency: (currency: "USD" | "INR" | "PKR") => void;
    convertPrice: (price: number) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [currency, setCurrency] = useState<"USD" | "INR" | "PKR">("USD");

    const rates = {
        USD: 1,
        INR: 83.50,
        PKR: 278.00
    };

    // Load cart from localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem("noir_eclat_cart");
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to load cart", e);
            }
        }
    }, []);

    // Save cart to localStorage
    useEffect(() => {
        localStorage.setItem("noir_eclat_cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: Product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id);
            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: string) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => setCart([]);

    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    const convertPrice = (price: number) => {
        return Math.round(price * rates[currency]);
    };

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalItems,
            totalPrice,
            currency,
            setCurrency,
            convertPrice
        }}>
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
