import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { CartItem, Product } from '../types';

interface CartContextType {
    items: CartItem[];
    isOpen: boolean;
    addToCart: (product: Product, quantity?: number, size?: string, color?: string) => void;
    removeFromCart: (id: string) => void;
    toggleCart: () => void;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>(() => {
        try {
            const saved = localStorage.getItem('agg_cart');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('agg_cart', JSON.stringify(items));
    }, [items]);

    const addToCart = (product: Product, quantity = 1, size?: string, color?: string) => {
        setItems((prev) => {
            // Check if item exists with same size/color
            const existing = prev.find(
                (item) => item.id === product.id && item.selectedSize === size && item.selectedColor === color
            );

            if (existing) {
                return prev.map((item) =>
                    item.id === product.id && item.selectedSize === size && item.selectedColor === color
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            return [...prev, { ...product, quantity, selectedSize: size, selectedColor: color }];
        });
        setIsOpen(true); // Open cart when item added
    };

    const removeFromCart = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const toggleCart = () => setIsOpen((prev) => !prev);

    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, isOpen, addToCart, removeFromCart, toggleCart, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};
