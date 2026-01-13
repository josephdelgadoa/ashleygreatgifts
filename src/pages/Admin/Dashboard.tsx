import React, { useState, useEffect } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { ProductEditor } from './ProductEditor';
import { initGoogleAuth, requestAccessToken, appendRow, findRowIndex, updateRow } from '../../services/googleSheetsAdmin';
import type { Product } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { products: initialProducts, loading } = useProducts();
  const [products, setProducts] = useState<Product[]>([]);
  const [spreadsheetId, setSpreadsheetId] = useState(localStorage.getItem('agg_sheet_id') || '');
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (initialProducts.length > 0) setProducts(initialProducts);
  }, [initialProducts]);

  useEffect(() => {
    // Initialize Google Auth
    initGoogleAuth((token) => {
      console.log('Auth Token received');
      setIsAuthorized(!!token);
    });
  }, []);

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  const handleConnect = () => requestAccessToken();

  const handleSaveSheetId = () => {
    const id = prompt("Enter your Google Sheet ID (from the browser URL when editing):", spreadsheetId);
    if (id) {
      setSpreadsheetId(id);
      localStorage.setItem('agg_sheet_id', id);
    }
  };

  const handleAddStart = () => {
    setEditingProduct(undefined);
    setIsEditorOpen(true);
  };

  const handleEditStart = (product: Product) => {
    setEditingProduct(product);
    setIsEditorOpen(true);
  };

  const handleSave = async (product: Product) => {
    if (!isAuthorized) {
      alert("Please connect your Google Account first.");
      handleConnect();
      return;
    }
    if (!spreadsheetId) {
      alert("Please configure your Spreadsheet ID.");
      handleSaveSheetId();
      return;
    }

    try {
      if (editingProduct) {
        // Update
        const index = await findRowIndex(spreadsheetId, product.id);
        if (index === -1) {
          alert("Could not find product in sheet to update.");
          return;
        }
        await updateRow(spreadsheetId, index, product);
        setProducts(products.map(p => p.id === product.id ? product : p));
        alert("Product updated successfully!");
      } else {
        // Add
        await appendRow(spreadsheetId, product);
        setProducts([...products, product]);
        alert("Product added successfully!");
      }
    } catch (error: any) {
      console.error(error);
      alert("Error saving to sheet: " + error.message);
    }
  };

  const handleDelete = (_id: string) => {
    alert("Deletion is currently only supported directly in the Google Sheet to prevent data misalignment.");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-20 shadow-sm">
        <h1 className="text-xl font-serif font-bold text-primary">AGG Backoffice</h1>
        <div className="flex gap-4 items-center">
          {!spreadsheetId && (
            <button onClick={handleSaveSheetId} className="text-xs text-red-500 underline font-bold">
              Configure Sheet ID
            </button>
          )}
          {!isAuthorized ? (
            <button
              onClick={handleConnect}
              className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
            >
              Connect Google
            </button>
          ) : (
            <span className="text-xs text-green-600 font-bold flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span> Connected
            </span>
          )}
          <a href="/" className="text-sm font-medium text-primary hover:text-accent">View Store &rarr;</a>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Inventory</h2>
            {spreadsheetId && <p className="text-xs text-gray-400 mt-1">Sheet ID: ...{spreadsheetId.slice(-6)}</p>}
          </div>
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
