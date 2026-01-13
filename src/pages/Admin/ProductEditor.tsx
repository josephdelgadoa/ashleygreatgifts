import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Product } from '../../types';

interface ProductEditorProps {
    isOpen: boolean;
    onClose: () => void;
    product?: Product;
    onSave: (product: Product) => void;
}

export const ProductEditor: React.FC<ProductEditorProps> = ({ isOpen, onClose, product, onSave }) => {
    const [formData, setFormData] = useState<Partial<Product>>({
        name: '',
        price: 0,
        category: '',
        images: [],
        sizes: [],
        colors: [],
        description: ''
    });

    useEffect(() => {
        if (product) {
            setFormData(product);
        } else {
            setFormData({
                name: '',
                price: 0,
                category: 'Women',
                images: [],
                sizes: [],
                colors: [],
                description: ''
            });
        }
    }, [product, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Basic validation could go here
        onSave({
            ...formData,
            id: product?.id || crypto.randomUUID(), // Generate temp ID if new
            price: Number(formData.price),
            // Ensure main image is set if images array has items
            image: formData.images?.[0] || formData.image || ''
        } as Product);
        onClose();
    };

    const handleAddImage = (url: string) => {
        if (!url) return;
        const currentImages = formData.images || [];
        if (currentImages.length >= 5) return;
        setFormData({
            ...formData,
            images: [...currentImages, url],
            image: currentImages.length === 0 ? url : formData.image
        });
    };

    const handleRemoveImage = (index: number) => {
        const currentImages = formData.images || [];
        const newImages = currentImages.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            images: newImages,
            image: newImages[0] || ''
        });
    };

    // Drag and drop mock handler (web-based file API requires upload storage backend)
    // For now, we will assume user inputs URLs or drops image to get base64 (too large for sheet)
    // Best approach for MVP: Input field that accepts multiple URLs.

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-up">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-serif font-bold text-primary">
                        {product ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Main Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Product Name</label>
                            <input
                                required
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Price ($)</label>
                            <input
                                required
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Category</label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary/20 outline-none"
                            >
                                <option value="Women">Women</option>
                                <option value="Men">Men</option>
                                <option value="Kids">Kids</option>
                                <option value="Accessories">Accessories</option>
                                <option value="Jewelry">Jewelry</option>
                            </select>
                        </div>
                    </div>

                    {/* Image Management */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">Product Images (Max 5)</label>
                        <div className="flex flex-wrap gap-4">
                            {(formData.images || []).map((img, idx) => (
                                <div key={idx} className="relative group w-24 h-24 border rounded overflow-hidden">
                                    <img src={img} alt="Product" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(idx)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                            {(formData.images?.length || 0) < 5 && (
                                <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors cursor-pointer relative">
                                    <span className="text-xs text-center p-1">Add Image URL</span>
                                    <input
                                        type="text"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => {
                                            if (e.target.value) {
                                                handleAddImage(e.target.value);
                                                e.target.value = '';
                                            }
                                        }}
                                        onBlur={(e) => {
                                            // Fallback if they type and click away
                                            if (e.target.value) {
                                                handleAddImage(e.target.value);
                                                e.target.value = '';
                                            }
                                        }}
                                    // Note: Simple prompt might be better UX than hidden input for URLs
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const url = prompt("Enter Image URL");
                                            if (url) handleAddImage(url);
                                        }}
                                        className="absolute inset-0 z-10 w-full h-full"
                                    />
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-gray-500">
                            Click the box to add a URL. Drag & Drop upload requires Google Drive integration (coming soon).
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Sizes (comma separated)</label>
                            <input
                                type="text"
                                value={formData.sizes?.join(', ')}
                                onChange={e => setFormData({ ...formData, sizes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                                placeholder="S, M, L, XL"
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Colors (comma separated)</label>
                            <input
                                type="text"
                                value={formData.colors?.join(', ')}
                                onChange={e => setFormData({ ...formData, colors: e.target.value.split(',').map(c => c.trim()).filter(Boolean) })}
                                placeholder="Red, Blue, Black"
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            rows={4}
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 text-gray-600 hover:text-gray-800 mr-4"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-2 bg-primary text-white rounded hover:bg-accent transition-colors shadow-lg"
                        >
                            Save Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
