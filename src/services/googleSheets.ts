import Papa from 'papaparse';
import { Product } from '../types';

// Placeholder URL - User needs to replace this with their published Sheet CSV link
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR_PLACEHOLDER_ID/pub?output=csv';

const MOCK_PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Cashmere Wool Blend Coat',
        price: 249.00,
        category: 'Women',
        image: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?q=80&w=800&auto=format&fit=crop',
        sizes: ['S', 'M', 'L'],
        colors: ['Beige', 'Black']
    },
    {
        id: '2',
        name: 'Minimalist Leather Tote',
        price: 189.00,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
    },
    {
        id: '3',
        name: 'Gold Plated Hoop Earrings',
        price: 49.00,
        category: 'Jewelry',
        image: 'https://images.unsplash.com/photo-1630019852942-f89202989a51?q=80&w=800&auto=format&fit=crop',
    },
    {
        id: '4',
        name: 'Mens Classic Wool Blazer',
        price: 299.00,
        category: 'Men',
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
    },
    {
        id: '5',
        name: 'Silk Scarf',
        price: 89.00,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop',
    },
    {
        id: '6',
        name: 'Black Denim Jacket',
        price: 129.00,
        category: 'Men',
        image: 'https://images.unsplash.com/photo-1521482819875-9c5c7cb1e5b4?q=80&w=800&auto=format&fit=crop',
    }
];

export const fetchProducts = async (): Promise<Product[]> => {
    try {
        // If URL is default/placeholder, return mock data immediately
        if (SHEET_CSV_URL.includes('PLACEHOLDER')) {
            console.warn('Using Mock Data. Configure SHEET_CSV_URL in services/googleSheets.ts');
            return new Promise((resolve) => setTimeout(() => resolve(MOCK_PRODUCTS), 800));
        }

        const response = await fetch(SHEET_CSV_URL);
        if (!response.ok) throw new Error('Failed to fetch CSV');
        const csvText = await response.text();

        return new Promise((resolve, reject) => {
            Papa.parse(csvText, {
                header: true,
                complete: (results) => {
                    const products: Product[] = results.data
                        .filter((row: any) => row.id && row.name) // Filter empty rows
                        .map((row: any) => ({
                            id: row.id,
                            name: row.name,
                            price: parseFloat(row.price),
                            category: row.category,
                            image: row.image, // Should be a direct link
                            sizes: row.sizes ? row.sizes.split(',') : [],
                            colors: row.colors ? row.colors.split(',') : [],
                            description: row.description
                        }));
                    resolve(products);
                },
                error: (error) => reject(error),
            });
        });
    } catch (error) {
        console.error('Error fetching/parsing products:', error);
        return MOCK_PRODUCTS; // Fallback to mock data on error
    }
};
