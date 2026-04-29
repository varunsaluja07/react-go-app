import { createContext, useContext, useState, useEffect } from 'react';

// 1. Create the Context (Like a global Spring Bean)
const CartContext = createContext();

// 2. Custom Hook for easy access
export const useCart = () => useContext(CartContext);

// 3. Provider Component that wraps our App
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [products, setProducts] = useState([]); // Add products state to the context
  const [loading, setLoading] = useState(true);

  // Fetch products so the Cart has access to their names
  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // Fetch initial cart from Go Backend when the app loads
  const fetchCart = async () => {
    try {
      // Notice we use /api/cart because of our Webpack Proxy!
      const res = await fetch('/api/cart');
      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };

  const loadInitialData = async () => {
    setLoading(true);
    // Fetch both products and cart in parallel for efficiency
    await Promise.all([fetchProducts(), fetchCart()]);
    setLoading(false);
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Function to add item to cart
  const addToCart = async (productId, quantity = 1) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity })
      });
      if (res.ok) {
        // If successful, re-fetch the cart from the backend to get the latest state
        await fetchCart();
      }
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  // Function to clear cart (mock checkout)
  const checkout = async (paymentMethod) => {
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethod })
      });
      if (res.ok) {
        const data = await res.json();
        // Clear local state
        setCart({ items: [] });
        return data;
      }
    } catch (err) {
      console.error("Checkout failed:", err);
    }
    return null;
  };

  // The value exposed to the rest of the app
  const value = {
    cart,
    products, // Export products so Cart can use them
    loading,
    addToCart,
    checkout
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
