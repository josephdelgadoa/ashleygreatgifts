import React, { useEffect } from 'react';
import { X, Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CartItem } from '../../types';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[];
    onRemove: (id: string) => void;
    onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onRemove, onCheckout }) => {
    // Prevent body scroll when cart is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black z-[60]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
                    >
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-secondary">
                            <h2 className="text-xl font-serif font-bold">Shopping Cart ({items.length})</h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                aria-label="Close cart"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <X className="w-8 h-8" />
                                    </div>
                                    <p>Your cart is empty.</p>
                                    <button
                                        onClick={onClose}
                                        className="mt-4 text-accent font-medium hover:underline"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4">
                                        <div className="w-20 h-24 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-serif font-medium text-primary">{item.name}</h3>
                                                <button
                                                    onClick={() => onRemove(item.id)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">${item.price.toFixed(2)}</p>
                                            {(item.selectedSize || item.selectedColor) && (
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {item.selectedSize} {item.selectedColor ? `| ${item.selectedColor}` : ''}
                                                </p>
                                            )}
                                            <div className="mt-2 text-sm text-gray-600">
                                                Qty: {item.quantity}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="p-6 border-t border-gray-100 bg-secondary">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-serif font-bold text-lg">${subtotal.toFixed(2)}</span>
                                </div>

                                <button
                                    onClick={onCheckout}
                                    className="w-full bg-[#primary] text-white py-4 px-6 uppercase tracking-widest font-bold hover:bg-accent transition-colors flex items-center justify-center gap-2 group mb-3 shadow-md border-b-4 border-green-700 active:border-b-0 active:translate-y-1"
                                    style={{ backgroundColor: '#25D366' }} // WhatsApp Color
                                >
                                    Checkout via WhatsApp
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </button>

                                <p className="text-xs text-center text-gray-400">
                                    Or contact us for custom orders
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
