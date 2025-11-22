import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  return (
    <header className="fixed top-0 left-0 w-full bg-[#333] text-white z-50">
      <div className="flex items-center justify-between px-2 sm:px-5 py-2 sm:py-3">
        <div className="flex items-center gap-1 sm:gap-4">
          <Link to="/">
            <button className="bg-[#444] hover:bg-[#555] text-white px-2 sm:px-5 py-2 rounded transition-colors text-sm sm:text-base">
              Home
            </button>
          </Link>
          <Link to="/contact">
            <button className="bg-[#444] hover:bg-[#555] text-white px-2 sm:px-5 py-2 rounded transition-colors text-sm sm:text-base">
              Contact
            </button>
          </Link>
          <Link to="/info">
            <button className="bg-[#444] hover:bg-[#555] text-white px-2 sm:px-5 py-2 rounded transition-colors text-sm sm:text-base">
              Info
            </button>
          </Link>
        </div>
        
        <Link to="/cart" className="relative">
          <button className="bg-[#444] hover:bg-[#555] text-white px-2 sm:px-5 py-2 rounded transition-colors flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
            <ShoppingCart size={18} className="sm:w-5 sm:h-5" />
            <span className="hidden xs:inline sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-600 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
                {cartCount}
              </span>
            )}
          </button>
        </Link>
      </div>
    </header>
  );
}