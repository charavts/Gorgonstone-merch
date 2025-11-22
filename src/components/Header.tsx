import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  return (
    <header className="fixed top-0 left-0 w-full bg-[#333] text-white z-50">
      <div className="flex items-center justify-between px-5 py-3">
        <div className="flex items-center gap-4">
          <Link to="/">
            <button className="bg-[#444] hover:bg-[#555] text-white px-5 py-2 rounded transition-colors">
              Home
            </button>
          </Link>
          <Link to="/contact">
            <button className="bg-[#444] hover:bg-[#555] text-white px-5 py-2 rounded transition-colors">
              Contact
            </button>
          </Link>
          <Link to="/info">
            <button className="bg-[#444] hover:bg-[#555] text-white px-5 py-2 rounded transition-colors">
              Info
            </button>
          </Link>
        </div>
        
        <Link to="/cart" className="relative">
          <button className="bg-[#444] hover:bg-[#555] text-white px-5 py-2 rounded transition-colors flex items-center gap-2">
            <ShoppingCart size={20} />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </Link>
      </div>
    </header>
  );
}