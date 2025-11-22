import { Link } from 'react-router-dom';
import { ShoppingCart, Languages } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export default function Header() {
  const { getCartCount } = useCart();
  const { language, toggleLanguage, t } = useLanguage();
  const cartCount = getCartCount();

  return (
    <header className="fixed top-0 left-0 w-full bg-[#333] text-white z-50">
      <div className="flex items-center justify-between px-1 sm:px-5 py-2 sm:py-3">
        <div className="flex items-center gap-0.5 sm:gap-4">
          <Link to="/">
            <button className="bg-[#444] hover:bg-[#555] text-white px-1.5 sm:px-5 py-2 rounded transition-colors text-xs sm:text-base">
              {t('nav.home')}
            </button>
          </Link>
          <Link to="/info">
            <button className="bg-[#444] hover:bg-[#555] text-white px-1.5 sm:px-5 py-2 rounded transition-colors text-xs sm:text-base">
              {t('nav.info')}
            </button>
          </Link>
          <Link to="/contact">
            <button className="bg-[#444] hover:bg-[#555] text-white px-1.5 sm:px-5 py-2 rounded transition-colors text-xs sm:text-base">
              {t('nav.contact')}
            </button>
          </Link>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Language Switcher - Shows CURRENT language */}
          <button
            onClick={toggleLanguage}
            className="bg-[#444] hover:bg-[#555] text-white px-2 sm:px-4 py-2 rounded transition-colors flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
            title={language === 'el' ? 'Ελληνικά - Πάτα για English' : 'English - Click for Ελληνικά'}
          >
            <Languages size={18} className="sm:w-5 sm:h-5" />
            <span className="font-semibold">{language === 'el' ? 'GR' : 'EN'}</span>
          </button>

          {/* Cart Button */}
          <Link to="/cart" className="relative">
            <button className="bg-[#444] hover:bg-[#555] text-white px-2 sm:px-5 py-2 rounded transition-colors flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
              <ShoppingCart size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden xs:inline sm:inline">{t('nav.cart')}</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-600 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
                  {cartCount}
                </span>
              )}
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}