import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import { useCart } from './context/CartContext';

// Simple Navigation Bar
const Navbar = () => {
  const { cart } = useCart();
  const totalItems = cart.items ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;

  return (
    <nav style={{ padding: '15px', backgroundColor: '#333', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '20px', marginRight: '30px' }}>Mini E-Commerce</h1>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '16px' }}>Products</Link>
      </div>
      <div>
        <Link to="/cart" style={{ color: 'white', textDecoration: 'none', fontSize: '16px' }}>
          Cart ({totalItems})
        </Link>
      </div>
    </nav>
  );
};

// Main App Component
function App() {
  return (
    // Wrap the entire app with our Context Provider so any component can access the cart
    <CartProvider>
      <Router>
        <div>
          <Navbar />
          <div style={{ padding: '20px' }}>
            <Routes>
              {/* Define our routes mapping to components */}
              <Route path="/" element={<ProductList />} />
              <Route path="/cart" element={<Cart />} />
            </Routes>
          </div>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
