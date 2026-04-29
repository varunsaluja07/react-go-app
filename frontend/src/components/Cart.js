import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Cart = () => {
  const { cart, products, loading, checkout } = useCart();
  const navigate = useNavigate(); // For redirecting after checkout
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  if (loading) return <div>Loading cart...</div>;

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    // Hardcode a payment method for now as per "Mocked Checkout" requirements
    const result = await checkout("credit_card");
    if (result) {
      setOrderResult(result);
    } else {
      alert("Checkout failed");
    }
    setIsCheckingOut(false);
  };

  // Helper function to find a product by its ID
  const getProductDetails = (productId) => {
    return products.find(p => p.id === productId) || { name: 'Unknown Product', price: 0 };
  };

  // Calculate cart total
  const cartTotal = cart.items.reduce((total, item) => {
    const product = getProductDetails(item.productId);
    return total + (product.price * item.quantity);
  }, 0);

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      
      {orderResult ? (
        <div style={{ backgroundColor: '#d4edda', padding: '20px', color: '#155724', borderRadius: '5px' }}>
          <h3>Success! Order Placed.</h3>
          <p>Order ID: {orderResult.orderId}</p>
          <button 
            onClick={() => navigate('/')}
            style={{ backgroundColor: '#155724', color: 'white', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Continue Shopping
          </button>
        </div>
      ) : cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {cart.items.map(item => {
              const product = getProductDetails(item.productId);
              return (
                <li key={item.productId} style={{ borderBottom: '1px solid #eee', padding: '15px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img src={product.imageUrl} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                    <div>
                      <h4 style={{ margin: 0 }}>{product.name}</h4>
                      <small style={{ color: '#666' }}>${product.price.toFixed(2)} each</small>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span>Qty: {item.quantity}</span>
                    <strong>${(product.price * item.quantity).toFixed(2)}</strong>
                  </div>
                </li>
              );
            })}
          </ul>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', borderTop: '2px solid #ccc', paddingTop: '20px' }}>
            <h3>Total: ${cartTotal.toFixed(2)}</h3>
            <button 
              onClick={handleCheckout} 
              disabled={isCheckingOut}
              style={{ backgroundColor: '#28a745', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}
            >
              {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
