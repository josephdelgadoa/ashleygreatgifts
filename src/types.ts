export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    image: string;
    sizes?: string[]; // CSV format: "S,M,L"
    colors?: string[]; // CSV format: "Red,Blue"
    description?: string;
}

export interface CartItem extends Product {
    selectedSize?: string;
    selectedColor?: string;
    quantity: number;
}
