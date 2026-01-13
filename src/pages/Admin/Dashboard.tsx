import React, { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { ProductEditor } from './ProductEditor';
import type { Product } from '../../types';

export const AdminDashboard: React.FC = () => {
    const { products: initialProducts, loading } = useProducts();
    const [products, setProducts] = useState<Product[]>([]);
    // Determine if we should show initial (fetched) or local state. 
    // For simplicity in this step, we'll sync them once loaded, 
    // assuming no complex real-time sync yet.

    React.useEffect(() => {
        if (initialProducts.length > 0) {
            setProducts(initialProducts);
        }
    }, [initialProducts]);

    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

    const handleAddStart = () => {
        setEditingProduct(undefined);
        setIsEditorOpen(true);
    };

    const handleEditStart = (product: Product) => {
        setEditingProduct(product);
        setIsEditorOpen(true);
    };

    const handleSave = (product: Product) => {
        console.log('Saving product:', product);
        // Here we will eventually call the Google Sheets API
        // For now, update local state
        if (editingProduct) {
            setProducts(products.map(p => p.id === product.id ? product : p));
        } else {
            setProducts([...products, product]);
        }
        // Note: This local update won't persist yet!
        alert('Product Saved locally (Refresh will reset until API is connected)');
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setProducts(products.filter(p => p.id !== id));
            // API call needed here
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-20">
                <h1 className="text-xl font-serif font-bold text-primary">AGG Backoffice</h1>
                <div className="flex gap-4 items-center">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Read Only (API Not Connected)</span>
                    <a href="/" className="text-sm font-medium text-primary hover:text-accent">View Store &rarr;</a>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Inventory</h2>
                    <button
                        onClick={handleAddStart}
                        className="bg-primary text-white px-6 py-2 rounded shadow hover:bg-accent transition-colors flex items-center gap-2"
                    >
                        <span>+</span> Add Product
                    </button>
                </div>

                <div className="bg-white rounded shadow overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading inventory from Sheets...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                                    <tr>
                                        <th className="px-6 py-4 font-medium uppercase tracking-wider">Image</th>
                                        <th className="px-6 py-4 font-medium uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-4 font-medium uppercase tracking-wider">Price</th>
                                        <th className="px-6 py-4 font-medium uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-4 font-medium uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {products.map(product => (
                                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <img
                                                    src={product.image}
                                                    alt=""
                                                    className="w-12 h-16 object-cover rounded bg-gray-100"
                                                />
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                                            <td className="px-6 py-4 text-gray-600">${product.price.toFixed(2)}</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-block px-2 py-1 text-xs bg-gray-100 rounded text-gray-600">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleEditStart(product)}
                                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-4"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="text-red-400 hover:text-red-600 text-sm font-medium"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <ProductEditor
                isOpen={isEditorOpen}
                onClose={() => setIsEditorOpen(false)}
                product={editingProduct}
                onSave={handleSave}
            />
        </div>
    );
};
