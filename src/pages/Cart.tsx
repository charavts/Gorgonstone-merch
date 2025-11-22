import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    // For now, open the first item's Stripe link
    // In a real implementation, you'd create a combined checkout
    if (cartItems.length === 1) {
      window.open(cartItems[0].stripeUrl, '_blank');
    } else {
      // If multiple items, you could handle differently
      alert('Please note: Each item will need to be purchased separately through Stripe.');
      // Open all Stripe links in new tabs
      cartItems.forEach(item => {
        window.open(item.stripeUrl, '_blank');
      });
    }
    
    clearCart();
  };

  if (cartItems.length === 0) {
    return (
      <main className="pt-24 pb-16 px-5 min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full bg-[#6a6562] rounded-lg shadow-2xl p-12 text-center">
          <ShoppingBag size={64} className="text-white/50 mx-auto mb-6" />
          <h2 className="text-white mb-4">Your Cart is Empty</h2>
          <p className="text-white/70 mb-6">
            Add some products to your cart to get started!
          </p>
          <Link to="/">
            <button className="bg-black hover:bg-[#444] text-white px-8 py-3 rounded-lg transition-colors">
              Continue Shopping
            </button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-16 px-5 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#6a6562] rounded-lg shadow-2xl p-6 md:p-8">
          <h1 className="text-white mb-6">Shopping Cart</h1>
          
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-[#56514f] rounded-lg p-4 flex flex-col md:flex-row gap-4 items-center"
              >
                <div className="w-24 h-24 flex-shrink-0">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-white mb-2">{item.name}</h3>
                  <p className="text-white/80">
                    {item.price}€ each
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="bg-[#444] hover:bg-[#555] text-white w-8 h-8 rounded flex items-center justify-center transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-white min-w-[2rem] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="bg-[#444] hover:bg-[#555] text-white w-8 h-8 rounded flex items-center justify-center transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <div className="text-white min-w-[80px] text-center md:text-right">
                  {(item.price * item.quantity).toFixed(2)}€
                </div>
                
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
          
          <div className="border-t border-white/20 pt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white">Total:</h2>
              <h2 className="text-white">{getCartTotal().toFixed(2)}€</h2>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/" className="flex-1">
                <button className="w-full bg-[#444] hover:bg-[#555] text-white px-6 py-4 rounded-lg transition-colors">
                  Continue Shopping
                </button>
              </Link>
              <button
                onClick={handleCheckout}
                className="flex-1 bg-black hover:bg-[#333] text-white px-6 py-4 rounded-lg transition-colors"
              >
                Continue with Purchase
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
