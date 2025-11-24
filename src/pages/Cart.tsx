import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, Globe } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Link } from 'react-router-dom';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const { t, language } = useLanguage();
  const [shippingCountry, setShippingCountry] = useState('GR');
  const [shippingCosts, setShippingCosts] = useState<Record<string, any>>({
    // Default fallback countries
    'GR': { name: 'Ελλάδα', nameEn: 'Greece', cost: 3.50 },
    'CY': { name: 'Κύπρος', nameEn: 'Cyprus', cost: 7.00 },
    'IT': { name: 'Ιταλία', nameEn: 'Italy', cost: 12.00 },
    'ES': { name: 'Ισπανία', nameEn: 'Spain', cost: 12.00 },
    'FR': { name: 'Γαλλία', nameEn: 'France', cost: 12.00 },
    'DE': { name: 'Γερμανία', nameEn: 'Germany', cost: 12.00 },
  });
  const [loadingSettings, setLoadingSettings] = useState(true);

  // Load shipping costs from site settings
  useEffect(() => {
    const loadShippingCosts = async () => {
      try {
        console.log('Loading shipping costs from API...');
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-deab0cbd/site-settings`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
            },
          }
        );
        
        console.log('API response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('API response data:', data);
          
          if (data.settings?.shippingCosts) {
            console.log('Shipping costs loaded:', data.settings.shippingCosts);
            setShippingCosts(data.settings.shippingCosts);
          } else {
            console.log('No shipping costs in response, using defaults');
          }
        } else {
          console.error('API response not OK:', response.status);
          const errorText = await response.text();
          console.error('Error details:', errorText);
        }
      } catch (error) {
        console.error('Error loading shipping costs:', error);
      } finally {
        setLoadingSettings(false);
      }
    };

    loadShippingCosts();
  }, []);

  // Manual refresh function for testing
  const refreshShippingCosts = async () => {
    setLoadingSettings(true);
    try {
      console.log('🔄 Manually refreshing shipping costs...');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-deab0cbd/site-settings`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Refreshed shipping costs:', data.settings?.shippingCosts);
        
        if (data.settings?.shippingCosts) {
          setShippingCosts(data.settings.shippingCosts);
          alert(language === 'el' ? 'Τιμές ενημερώθηκαν!' : 'Prices updated!');
        }
      } else {
        const errorText = await response.text();
        console.error('Refresh error:', response.status, errorText);
        alert(language === 'el' ? 'Σφάλμα ανανέωσης' : 'Refresh error');
      }
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setLoadingSettings(false);
    }
  };

  // Calculate shipping cost based on country
  const getShippingCost = () => {
    if (!shippingCosts[shippingCountry]) {
      return 12.00; // Default fallback
    }
    return shippingCosts[shippingCountry].cost;
  };

  const shippingCost = getShippingCost();
  const subtotal = getCartTotal();
  const total = subtotal + shippingCost;

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    setIsLoading(true);

    try {
      console.log('Starting checkout process...');
      console.log('Cart items:', cartItems);
      console.log('Selected language:', language);
      console.log('Shipping country:', shippingCountry);
      console.log('Shipping cost:', shippingCost);
      
      // Call Supabase Edge Function to create Stripe checkout session
      const url = `https://${projectId}.supabase.co/functions/v1/make-server-deab0cbd/create-checkout`;
      console.log('Calling URL:', url);
      console.log('Project ID:', projectId);
      console.log('Public Anon Key:', publicAnonKey ? 'Present' : 'Missing');
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            image: item.image,
            color: item.color,
          })),
          locale: language === 'el' ? 'el' : 'en',
          shippingCountry: shippingCountry,
          shippingCost: shippingCost,
        }),
      });

      console.log('Response received');
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        console.error('Checkout error:', data.error);
        alert(`Failed to create checkout session: ${data.error || 'Unknown error'}`);
        return;
      }

      if (data.url) {
        console.log('Redirecting to Stripe:', data.url);
        
        // Save shipping info to localStorage for order tracking
        localStorage.setItem('last_shipping_country', shippingCountry);
        localStorage.setItem('last_shipping_cost', shippingCost.toString());
        
        // Clear cart before redirect
        clearCart();
        // Redirect to Stripe checkout - use window.top for iframe compatibility
        try {
          window.top.location.href = data.url;
        } catch (e) {
          // Fallback if top access is blocked
          window.location.href = data.url;
        }
      } else {
        console.error('No URL in response');
        alert('Failed to get checkout URL. Please try again.');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert(`An error occurred: ${error.message}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <main className="pt-24 pb-16 px-5 min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full bg-[#6a6562] rounded-lg shadow-2xl p-12 text-center">
          <ShoppingBag size={64} className="text-white/50 mx-auto mb-6" />
          <h2 className="text-white mb-4">{t('cart.empty')}</h2>
          <p className="text-white/70 mb-6">
            Add some products to your cart to get started!
          </p>
          <Link to="/">
            <button className="bg-black hover:bg-[#444] text-white px-8 py-3 rounded-lg transition-colors cursor-pointer">
              {t('cart.continueShopping')}
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
          <h1 className="text-white mb-6">{t('cart.title')}</h1>
          
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <div
                key={`${item.id}-${item.size}-${item.color || 'default'}`}
                className="bg-[#56514f] rounded-lg p-4 flex flex-col md:flex-row gap-4 items-center"
              >
                <div className="w-24 h-24 flex-shrink-0">
                  <ImageWithFallback
                    src={item.color && item.imageVariants ? item.imageVariants[item.color] : item.image}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-white mb-2">{item.name}</h3>
                  <p className="text-white/80">
                    {item.price}€ each
                  </p>
                  <p className="text-white/60 text-sm mt-1">
                    {t('cart.size')}: {item.size}
                    {item.color && ` | ${t('cart.color')}: ${item.color}`}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.size, item.quantity - 1, item.color)}
                    className="bg-[#444] hover:bg-[#555] text-white w-8 h-8 rounded flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-white min-w-[2rem] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.size, item.quantity + 1, item.color)}
                    className="bg-[#444] hover:bg-[#555] text-white w-8 h-8 rounded flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <div className="text-white min-w-[80px] text-center md:text-right">
                  {(item.price * item.quantity).toFixed(2)}€
                </div>
                
                <button
                  onClick={() => removeFromCart(item.id, item.size, item.color)}
                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors cursor-pointer"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
          
          {/* Shipping Country Selector */}
          <div className="border-t border-white/20 pt-6 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Globe size={20} className="text-white" />
              <h3 className="text-white">
                {language === 'el' ? 'Χώρα Αποστολής' : 'Shipping Country'}
              </h3>
            </div>
            <select
              value={shippingCountry}
              onChange={(e) => setShippingCountry(e.target.value)}
              className="w-full bg-[#56514f] text-white border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-white/40 transition-colors"
            >
              {loadingSettings ? (
                <option>{language === 'el' ? 'Φόρτωση...' : 'Loading...'}</option>
              ) : (
                Object.entries(shippingCosts).map(([code, data]: [string, any]) => (
                  <option key={code} value={code}>
                    {language === 'el' ? data.name : data.nameEn} - {data.cost.toFixed(2)}€
                  </option>
                ))
              )}
            </select>
            <p className="text-white/50 text-sm mt-2">
              {language === 'el' 
                ? 'Επιλέξτε τη χώρα αποστολής για να υπολογιστεί το κόστος μεταφορικών' 
                : 'Select your shipping country to calculate shipping cost'}
            </p>
          </div>

          <div className="border-t border-white/20 pt-6">
            {/* Price Breakdown */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between items-center text-white/80">
                <span>{language === 'el' ? 'Υποσύνολο' : 'Subtotal'}:</span>
                <span>{subtotal.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between items-center text-white/80">
                <span>{language === 'el' ? 'Μεταφορικά' : 'Shipping'} ({shippingCountry}):</span>
                <span>{shippingCost.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-white/10">
                <h2 className="text-white">{t('cart.total')}:</h2>
                <h2 className="text-white">{total.toFixed(2)}€</h2>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/" className="flex-1">
                <button className="w-full bg-[#444] hover:bg-[#555] text-white px-6 py-4 rounded-lg transition-colors cursor-pointer">
                  {t('cart.continueShopping')}
                </button>
              </Link>
              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="flex-1 bg-black hover:bg-[#333] text-white px-6 py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? t('cart.processing') : t('cart.continuePurchase')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}