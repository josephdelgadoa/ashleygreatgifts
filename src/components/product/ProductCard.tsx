import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../../types';

interface ProductCardProps {
    product: Product;
    onAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group"
        >
            <div className="relative overflow-hidden aspect-[3/4] bg-gray-100 mb-4 rounded-sm">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    isLoading="lazy"
                />

                {/* Quick Add Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button
                        onClick={() => onAddToCart?.(product)}
                        className="w-full bg-white/90 backdrop-blur text-primary py-3 px-4 text-sm uppercase tracking-wider font-medium hover:bg-accent hover:text-white transition-colors flex items-center justify-center gap-2 shadow-lg"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        Quick Add
                    </button>
                </div>
            </div>

            <div className="text-center">
                <h3 className="text-lg font-serif font-medium text-primary mb-1 group-hover:text-accent transition-colors">
                    {product.name}
                </h3>
                <p className="text-sm font-medium text-gray-500">
                    ${product.price.toFixed(2)}
                </p>
            </div>
        </motion.div>
    );
};
