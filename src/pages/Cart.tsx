import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, Globe } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Link } from 'react-router-dom';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const { t, language } = useLanguage();
  const [shippingCountry, setShippingCountry] = useState('GR');

  // Calculate shipping cost based on country
  const getShippingCost = () => {
    if (shippingCountry === 'GR') return 3.50;
    if (shippingCountry === 'CY') return 7.00;
    return 12.00; // All other countries
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
              <option value="GR">{language === 'el' ? 'Ελλάδα' : 'Greece'} - 3.50€</option>
              <option value="CY">{language === 'el' ? 'Κύπρος' : 'Cyprus'} - 7.00€</option>
              <option value="AL">{language === 'el' ? 'Αλβανία' : 'Albania'} - 12.00€</option>
              <option value="AD">{language === 'el' ? 'Ανδόρρα' : 'Andorra'} - 12.00€</option>
              <option value="AT">{language === 'el' ? 'Αυστρία' : 'Austria'} - 12.00€</option>
              <option value="BY">{language === 'el' ? 'Λευκορωσία' : 'Belarus'} - 12.00€</option>
              <option value="BE">{language === 'el' ? 'Βέλγιο' : 'Belgium'} - 12.00€</option>
              <option value="BA">{language === 'el' ? 'Βοσνία-Ερζεγοβίνη' : 'Bosnia and Herzegovina'} - 12.00€</option>
              <option value="BG">{language === 'el' ? 'Βουλγαρία' : 'Bulgaria'} - 12.00€</option>
              <option value="HR">{language === 'el' ? 'Κροατία' : 'Croatia'} - 12.00€</option>
              <option value="CZ">{language === 'el' ? 'Τσεχία' : 'Czech Republic'} - 12.00€</option>
              <option value="DK">{language === 'el' ? 'Δανία' : 'Denmark'} - 12.00€</option>
              <option value="EE">{language === 'el' ? 'Εσθονία' : 'Estonia'} - 12.00€</option>
              <option value="FI">{language === 'el' ? 'Φινλανδία' : 'Finland'} - 12.00€</option>
              <option value="FR">{language === 'el' ? 'Γαλλία' : 'France'} - 12.00€</option>
              <option value="DE">{language === 'el' ? 'Γερμανία' : 'Germany'} - 12.00€</option>
              <option value="HU">{language === 'el' ? 'Ουγγαρία' : 'Hungary'} - 12.00€</option>
              <option value="IS">{language === 'el' ? 'Ισλανδία' : 'Iceland'} - 12.00€</option>
              <option value="IE">{language === 'el' ? 'Ιρλανδία' : 'Ireland'} - 12.00€</option>
              <option value="IT">{language === 'el' ? 'Ιταλία' : 'Italy'} - 12.00€</option>
              <option value="XK">{language === 'el' ? 'Κοσσυφοπέδιο' : 'Kosovo'} - 12.00€</option>
              <option value="LV">{language === 'el' ? 'Λετονία' : 'Latvia'} - 12.00€</option>
              <option value="LI">{language === 'el' ? 'Λιχτενστάιν' : 'Liechtenstein'} - 12.00€</option>
              <option value="LT">{language === 'el' ? 'Λιθουανία' : 'Lithuania'} - 12.00€</option>
              <option value="LU">{language === 'el' ? 'Λουξεμβούργο' : 'Luxembourg'} - 12.00€</option>
              <option value="MT">{language === 'el' ? 'Μάλτα' : 'Malta'} - 12.00€</option>
              <option value="MD">{language === 'el' ? 'Μολδαβία' : 'Moldova'} - 12.00€</option>
              <option value="MC">{language === 'el' ? 'Μονακό' : 'Monaco'} - 12.00€</option>
              <option value="ME">{language === 'el' ? 'Μαυροβούνιο' : 'Montenegro'} - 12.00€</option>
              <option value="NL">{language === 'el' ? 'Ολλανδία' : 'Netherlands'} - 12.00€</option>
              <option value="MK">{language === 'el' ? 'Βόρεια Μακεδονία' : 'North Macedonia'} - 12.00€</option>
              <option value="NO">{language === 'el' ? 'Νορβηγία' : 'Norway'} - 12.00€</option>
              <option value="PL">{language === 'el' ? 'Πολωνία' : 'Poland'} - 12.00€</option>
              <option value="PT">{language === 'el' ? 'Πορτογαλία' : 'Portugal'} - 12.00€</option>
              <option value="RO">{language === 'el' ? 'Ρουμανία' : 'Romania'} - 12.00€</option>
              <option value="RU">{language === 'el' ? 'Ρωσία' : 'Russia'} - 12.00€</option>
              <option value="SM">{language === 'el' ? 'Άγιος Μαρίνος' : 'San Marino'} - 12.00€</option>
              <option value="RS">{language === 'el' ? 'Σερβία' : 'Serbia'} - 12.00€</option>
              <option value="SK">{language === 'el' ? 'Σλοβακία' : 'Slovakia'} - 12.00€</option>
              <option value="SI">{language === 'el' ? 'Σλοβενία' : 'Slovenia'} - 12.00€</option>
              <option value="ES">{language === 'el' ? 'Ισπανία' : 'Spain'} - 12.00€</option>
              <option value="SE">{language === 'el' ? 'Σουηδία' : 'Sweden'} - 12.00€</option>
              <option value="CH">{language === 'el' ? 'Ελβετία' : 'Switzerland'} - 12.00€</option>
              <option value="TR">{language === 'el' ? 'Τουρκία' : 'Turkey'} - 12.00€</option>
              <option value="UA">{language === 'el' ? 'Ουκρανία' : 'Ukraine'} - 12.00€</option>
              <option value="GB">{language === 'el' ? 'Ηνωμένο Βασίλειο' : 'United Kingdom'} - 12.00€</option>
              <option value="VA">{language === 'el' ? 'Βατικανό' : 'Vatican City'} - 12.00€</option>
              <option value="US">{language === 'el' ? 'ΗΠΑ' : 'USA'} - 12.00€</option>
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