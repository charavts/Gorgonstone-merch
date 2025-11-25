import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export default function Success() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();
  const { t } = useLanguage();
  const { user, getAccessToken } = useAuth();
  const [orderSaved, setOrderSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saveOrder = async () => {
      // Only proceed if we have user and sessionId and haven't saved yet
      if (!user || !sessionId || orderSaved || saving) {
        console.log('⏭️ Skipping save:', { 
          hasUser: !!user, 
          hasSessionId: !!sessionId, 
          orderSaved, 
          saving 
        });
        return;
      }

      setSaving(true);
      setError(null);

      try {
        console.log('💾 Saving order from Stripe session:', sessionId);
        console.log('👤 User:', user.email);
        
        const accessToken = await getAccessToken();
        
        if (!accessToken) {
          console.error('❌ No access token available');
          setError('Authentication error - please log in again');
          return;
        }

        console.log('🔑 Access token obtained');

        // Call new endpoint that retrieves from Stripe and saves
        const url = `https://${projectId}.supabase.co/functions/v1/make-server-deab0cbd/retrieve-and-save-order`;
        console.log('📡 Calling:', url);

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ sessionId }),
        });

        console.log('📥 Response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Order saved successfully:', data.order);
          
          if (data.alreadyExists) {
            console.log('ℹ️ Order was already saved previously');
          }
          
          setOrderSaved(true);
          
          // Clear cart after successful save
          clearCart();
        } else {
          const errorText = await response.text();
          console.error('❌ Failed to save order:', errorText);
          setError(`Failed to save order: ${errorText}`);
        }
      } catch (error) {
        console.error('❌ Error saving order:', error);
        setError(`Error: ${error.message}`);
      } finally {
        setSaving(false);
      }
    };

    saveOrder();
  }, [user, sessionId, orderSaved, saving, getAccessToken, clearCart]);

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

        {/* Error Message */}
        {error && (
          <div className="mt-4 text-center">
            <AlertCircle size={24} className="text-red-500 inline-block mr-2" />
            <p className="text-red-500">{error}</p>
          </div>
        )}
      </div>
    </main>
  );
}