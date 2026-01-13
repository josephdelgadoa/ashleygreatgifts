export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    image: string;
    images?: string[]; // Array of image URLs (up to 5)
    sizes?: string[]; // CSV format: "S,M,L"
    colors?: string[]; // CSV format: "Red,Blue"
    description?: string;
}

export interface CartItem extends Product {
    selectedSize?: string;
    selectedColor?: string;
    quantity: number;
}
