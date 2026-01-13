import Papa from 'papaparse';
import type { Product } from '../types';

// Placeholder URL - User needs to replace this with their published Sheet CSV link
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTDGduXwmV7_HTN6yCoGVpNZz-WilPUBb4AVvzml-lm7CU1dqr7cgwvk6tZDhjtOHqd9mgk1tBARCNc/pub?output=csv';

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
        colors: ['Brown', 'Black']
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
        sizes: ['M', 'L', 'XL'],
        colors: ['Navy', 'Grey']
    },
    {
        id: '5',
        name: 'Silk Scarf',
        price: 89.00,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop',
        colors: ['Floral', 'Abstract']
    },
    {
        id: '6',
        name: 'Black Denim Jacket',
        price: 129.00,
        category: 'Men',
        image: 'https://images.unsplash.com/photo-1521482819875-9c5c7cb1e5b4?q=80&w=800&auto=format&fit=crop',
        sizes: ['S', 'M', 'L', 'XL']
    },
    {
        id: '7',
        name: 'Summer Linen Dress',
        price: 159.00,
        category: 'Women',
        image: 'https://images.unsplash.com/photo-1596783076218-bc71dd220263?q=80&w=800&auto=format&fit=crop',
        sizes: ['XS', 'S', 'M'],
        colors: ['White', 'Sage']
    },
    {
        id: '8',
        name: 'Kids Cotton Tee Set',
        price: 35.00,
        category: 'Kids',
        image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=800&auto=format&fit=crop',
        sizes: ['2T', '4T', '6T']
    },
    {
        id: '9',
        name: 'Premium Leather Belt',
        price: 55.00,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1551488852-d80429737887?q=80&w=800&auto=format&fit=crop',
        colors: ['Brown', 'Black', 'Tan']
    },
    {
        id: '10',
        name: 'Aviator Sunglasses',
        price: 110.00,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop',
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
                complete: (results: Papa.ParseResult<any>) => {
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

                    // Fallback to mock data if sheet is empty
                    if (products.length === 0) {
                        console.warn('Sheet empty. Using Mock Data.');
                        resolve(MOCK_PRODUCTS);
                    } else {
                        resolve(products);
                    }
                },
                error: (error: any) => {
                    // resolve with mock data on parse error to keep site alive
                    console.error('CSV Parse Error, using mock data:', error);
                    resolve(MOCK_PRODUCTS);
                },
            });
        });
    } catch (error) {
        console.error('Error fetching products, using mock data:', error);
        return MOCK_PRODUCTS; // Fallback to mock data on network error
    }
};
