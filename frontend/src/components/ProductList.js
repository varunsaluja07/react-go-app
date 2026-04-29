import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart(); // Access the function we made in our CartContext

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        // Sort products by ID to keep the display order consistent
        data.sort((a, b) => a.id.localeCompare(b.id));
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) return <div>Loading products...</div>;

  return (
    <div className="product-list">
      <h2>Products</h2>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {products.map(product => (
          <div key={product.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', width: '250px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '180px', overflow: 'hidden', marginBottom: '10px', borderRadius: '4px' }}>
              <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h3 style={{ margin: '0 0 10px 0' }}>{product.name}</h3>
            <p style={{ margin: '0 0 15px 0', color: '#666', flexGrow: 1 }}>{product.description}</p>
            <p style={{ margin: '0 0 15px 0', fontSize: '1.2em' }}><strong>${product.price.toFixed(2)}</strong></p>
            <button 
              onClick={() => addToCart(product.id, 1)}
              style={{ backgroundColor: '#007bff', color: 'white', padding: '10px', border: 'none', cursor: 'pointer', width: '100%', borderRadius: '4px', fontWeight: 'bold' }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
