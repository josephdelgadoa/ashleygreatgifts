import React from 'react';
import { useProducts } from '../../hooks/useProducts';

export const AdminDashboard: React.FC = () => {
    const { products, loading } = useProducts();

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
                <h1 className="text-xl font-serif font-bold text-primary">AGG Backoffice</h1>
                <a href="/" className="text-sm text-gray-500 hover:text-primary">View Store &rarr;</a>
            </nav>

            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Products</h2>
                    <button className="bg-primary text-white px-6 py-2 rounded shadow hover:bg-accent transition-colors">
                        + Add Product
                    </button>
                </div>

                <div className="bg-white rounded shadowoverflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading inventory...</div>
                    ) : (
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
                                            <img src={product.image} alt="" className="w-12 h-16 object-cover rounded" />
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                                        <td className="px-6 py-4 text-gray-600">${product.price.toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-block px-2 py-1 text-xs bg-gray-100 rounded text-gray-600">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-4">Edit</button>
                                            <button className="text-red-400 hover:text-red-600 text-sm font-medium">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};
