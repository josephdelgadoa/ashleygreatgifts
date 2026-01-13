import React from 'react';
import { Header } from './components/layout/Header';
import { ProductCard } from './components/product/ProductCard';
import { CartDrawer } from './components/cart/CartDrawer';
import { CartProvider, useCart } from './context/CartContext';
import { useProducts } from './hooks/useProducts';

const MainContent: React.FC = () => {
  const { addToCart, items, isOpen, toggleCart, removeFromCart } = useCart();
  const { products, loading } = useProducts();

  const handleCheckout = () => {
    // WhatsApp Logic construction
    const phoneNumber = "19547580512"; // Replace with actual business number
    const message = items.map(item =>
      `- ${item.name} (${item.quantity}) - $${item.price}` +
      (item.selectedSize ? ` [Size: ${item.selectedSize}]` : '')
    ).join('%0a');

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
    const text = `Hi, I'd like to place an order:%0a${message}%0a%0aTotal: $${total}`;

    window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');
  };

  return (
    <>
      <Header />
      <CartDrawer
        isOpen={isOpen}
        onClose={toggleCart}
        items={items}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
      />

      <main className="pt-24 pb-12">
        {/* Hero */}
        <div className="container mx-auto px-4 mb-20 text-center animate-fade-up">
          <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-primary">
            Winter Collection 2026
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-8 text-lg font-light">
            Discover the new standard of elegance. Minimalist designs curated for the modern lifestyle.
          </p>
          <button className="bg-primary text-white px-10 py-4 uppercase tracking-widest text-sm font-bold hover:bg-accent transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
            Shop Now
          </button>
        </div>

        {/* Product Grid */}
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
            <h3 className="text-2xl font-serif font-bold">New Arrivals</h3>
            <a href="#" className="text-sm font-medium hover:text-accent">View All &rarr;</a>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={(p) => addToCart(p, 1)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white py-12 border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6">
            <h3 className="font-serif font-bold text-xl mb-2 tracking-widest uppercase">Ashley Great Gifts</h3>
            <p className="text-sm text-gray-500 italic">Premium Fashion & Accessories</p>
          </div>
          <div className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} AGG. Powered by Nexa Sphere.
          </div>
        </div>
      </footer>
    </>
  );
};

function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-secondary flex flex-col">
        <MainContent />
      </div>
    </CartProvider>
  );
}

export default App;
