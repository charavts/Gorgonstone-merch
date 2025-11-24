import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export default function Success() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { cart, clearCart } = useCart();
  const { t } = useLanguage();
  const { user, getAccessToken } = useAuth();
  const [orderSaved, setOrderSaved] = useState(false);

  useEffect(() => {
    const saveOrderAndClearCart = async () => {
      // Only save order if user is logged in and we have cart items
      if (!user || !sessionId || cart.length === 0 || orderSaved) {
        if (cart.length > 0 && !orderSaved) {
          clearCart(); // Clear cart even if not logged in
        }
        return;
      }

      try {
        console.log('💾 Saving order after successful payment...');
        
        // Get cart data before clearing
        const orderItems = cart.map(item => ({
          productId: item.id,
          name: item.name,
          nameEl: item.nameEl,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          price: item.price,
          image: item.image
        }));

        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        
        // Get shipping info from localStorage (saved during checkout)
        const shippingCountry = localStorage.getItem('last_shipping_country') || 'GR';
        const shippingCostStr = localStorage.getItem('last_shipping_cost') || '3.50';
        const shippingCost = parseFloat(shippingCostStr);

        // Create a basic shipping address (Stripe has the real one)
        // In a real app, you'd fetch this from Stripe API
        const shippingAddress = {
          name: user.name || user.email || 'Customer',
          email: user.email || '',
          address: 'Provided during checkout',
          city: '',
          postalCode: '',
          country: shippingCountry
        };

        const accessToken = await getAccessToken();
        
        if (!accessToken) {
          console.error('No access token available');
          clearCart();
          return;
        }

        // Save order to backend
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-deab0cbd/save-order`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              orderId: sessionId,
              items: orderItems,
              total,
              shippingCost,
              shippingAddress,
              paymentMethod: 'Card (****)'
            }),
          }
        );

        if (response.ok) {
          console.log('✅ Order saved successfully');
          setOrderSaved(true);
        } else {
          console.error('Failed to save order:', await response.text());
        }
      } catch (error) {
        console.error('Error saving order:', error);
      } finally {
        // Always clear cart after payment success
        clearCart();
      }
    };

    saveOrderAndClearCart();
  }, [user, sessionId, cart, clearCart, orderSaved, getAccessToken]);

  return (
    <main className="pt-24 pb-16 px-5 min-h-screen flex items-center justify-center">
      <div className="max-w-2xl w-full bg-[#6a6562] rounded-lg shadow-2xl p-8 md:p-12">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-500/20 rounded-full p-4">
            <CheckCircle size={80} className="text-green-400" strokeWidth={2} />
          </div>
        </div>

        {/* Main Message */}
        <div className="text-center mb-8">
          <h1 className="text-white mb-4">{t('success.title')}</h1>
          <p className="text-white/90 text-lg mb-4">
            {t('success.thanks')}
          </p>
          <p className="text-white/70 mb-2">
            {t('success.emailConfirm')}
          </p>
        </div>

        {/* Order Details */}
        {sessionId && (
          <div className="bg-black/20 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center gap-3 text-white/80">
              <Package size={20} />
              <div>
                <p className="text-white/60 text-sm mb-1">{t('success.orderId')}</p>
                <p className="text-white font-mono text-sm break-all">
                  {sessionId}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="flex-1 sm:flex-initial">
            <button className="w-full bg-black hover:bg-[#333] text-white px-8 py-4 rounded-lg transition-colors flex items-center justify-center gap-2 group">
              <span>{t('success.continueShopping')}</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}