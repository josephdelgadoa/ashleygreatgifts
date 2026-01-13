```javascript
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
