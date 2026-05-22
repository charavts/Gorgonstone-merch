import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Calendar, CreditCard, MapPin, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface OrderItem {
  productId: string;
  name: string;
  nameEl?: string;
  size: string;
  color?: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  orderId: string;
  sessionId?: string; // Optional - for reference
  userId: string;
  items: OrderItem[];
  total: number;
  shippingCost: number;
  shippingAddress: {
    name: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  status: 'paid' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
}

export default function MyOrders() {
  const { t, language } = useLanguage();
  const { user, getAccessToken } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate('/login');
      return;
    }

    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      console.log('📦 Fetching orders for user:', user?.id);
      
      const accessToken = await getAccessToken();
      
      if (!accessToken) {
        console.error('❌ No access token available');
        return;
      }

      const url = `https://${projectId}.supabase.co/functions/v1/make-server-deab0cbd/my-orders`;
      console.log('📡 Calling my-orders endpoint:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      console.log('📥 My-orders response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Orders received:', data.orders.length);
        console.log('🔍 First order items:', data.orders[0]?.items);
        console.log('🖼️ First item image:', data.orders[0]?.items[0]?.image);
        setOrders(data.orders);
      } else {
        console.error('❌ Failed to fetch orders');
      }
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'el' ? 'el-GR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-600';
      case 'processing':
        return 'bg-blue-600';
      case 'shipped':
        return 'bg-purple-600';
      case 'delivered':
        return 'bg-gray-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    return t(`orders.status${status.charAt(0).toUpperCase() + status.slice(1)}`);
  };

  const handleSyncOrders = async () => {
    setSyncing(true);
    setSyncMessage(null);

    try {
      console.log('🔄 Starting order sync...');
      
      const accessToken = await getAccessToken();
      
      if (!accessToken) {
        console.error('❌ No access token available');
        setSyncMessage({ 
          type: 'error', 
          text: language === 'el' ? 'Σφάλμα ταυτοποίησης' : 'Authentication error'
        });
        return;
      }

      const url = `https://${projectId}.supabase.co/functions/v1/make-server-deab0cbd/sync-orders`;
      console.log('📡 Calling sync endpoint:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      console.log('📥 Sync response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Sync complete:', data);

        const message = language === 'el' 
          ? `Συγχρονισμός ολοκληρώθηκε! ${data.syncedCount} νέες παραγγελίες προστέθηκαν.`
          : `Sync complete! ${data.syncedCount} new orders added.`;

        setSyncMessage({ type: 'success', text: message });

        // Refresh orders list
        await fetchOrders();
      } else {
        const errorText = await response.text();
        console.error('❌ Sync failed:', errorText);
        setSyncMessage({ 
          type: 'error', 
          text: language === 'el' ? 'Σφάλμα συγχρονισμού' : 'Sync failed'
        });
      }
    } catch (error) {
      console.error('❌ Error syncing orders:', error);
      setSyncMessage({ 
        type: 'error', 
        text: language === 'el' ? 'Σφάλμα συγχρονισμού' : 'Sync error'
      });
    } finally {
      setSyncing(false);
      
      // Clear message after 5 seconds
      setTimeout(() => setSyncMessage(null), 5000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-10" style={{ backgroundColor: '#6a6562' }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-white/30 border-t-white rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-10" style={{ backgroundColor: '#6a6562' }}>
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-white mb-2">{t('orders.title')}</h1>
            <div className="h-1 w-20 bg-white/50 rounded"></div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSyncOrders}
              disabled={syncing}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw size={18} className={syncing ? 'animate-spin' : ''} />
              <span>
                {syncing 
                  ? (language === 'el' ? 'Συγχρονισμός...' : 'Syncing...') 
                  : (language === 'el' ? 'Συγχρονισμός' : 'Sync Orders')}
              </span>
            </button>
          </div>
        </div>

        {/* Sync Message */}
        {syncMessage && (
          <div className={`mb-6 p-4 rounded-lg ${
            syncMessage.type === 'success' ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'
          }`}>
            {syncMessage.text}
          </div>
        )}

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-[#56514f] rounded-lg p-8 text-center">
            <Package size={64} className="mx-auto mb-4 text-white/50" />
            <p className="text-white text-xl mb-6">{t('orders.noOrders')}</p>
            <Link to="/">
              <button className="bg-white text-[#56514f] px-6 py-3 rounded-lg hover:bg-white/90 transition-colors">
                {t('orders.startShopping')}
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.orderId} className="bg-[#56514f] rounded-lg overflow-hidden">
                {/* Order Header */}
                <div className="bg-[#444] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    {/* Left side: Order ID */}
                    <div>
                      <p className="text-white/60 text-xs uppercase tracking-wide mb-1">
                        {t('orders.orderId')}
                      </p>
                      <p className="text-white font-mono">
                        #{order.orderId.replace('pi_', '').replace('pi_live_', '').slice(0, 16).toUpperCase()}
                      </p>
                    </div>
                    
                    {/* Right side: Date */}
                    <div className="flex items-center gap-2 text-white/80">
                      <Calendar size={16} />
                      <span className="text-sm">{formatDate(order.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">{/* Changed from p-4 to p-6 for more breathing room */}
                  <h3 className="text-white/90 mb-4 text-sm uppercase tracking-wide">{t('orders.items')}</h3>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 bg-[#444] p-4 rounded-lg">
                        <ImageWithFallback
                          src={item.image}
                          alt={language === 'el' && item.nameEl ? item.nameEl : item.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="text-white mb-2">
                            {language === 'el' && item.nameEl ? item.nameEl : item.name}
                          </p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-white/60 text-sm">
                            <span>{t('cart.size')}: {item.size}</span>
                            {item.color && <span>{t('cart.color')}: {item.color}</span>}
                            <span>{t('cart.quantity')}: {item.quantity}</span>
                          </div>
                        </div>
                        <p className="text-white">€{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="flex justify-end">
                      <div className="space-y-3 min-w-[280px]">
                        <div className="flex justify-between items-center text-white/70">
                          <span>{language === 'el' ? 'Υποσύνολο' : 'Subtotal'}:</span>
                          <span>€{order.total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-white/70">
                          <span>{language === 'el' ? 'Μεταφορικά' : 'Shipping'}:</span>
                          <span>€{order.shippingCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-white/10">
                          <div className="flex items-center gap-3">
                            <span className="text-white font-medium">{t('orders.total')}:</span>
                            <span className={`${getStatusColor(order.status)} text-white px-3 py-1 rounded-full text-xs font-medium`}>
                              {getStatusText(order.status)}
                            </span>
                          </div>
                          <span className="text-white text-xl font-medium">€{(order.total + order.shippingCost).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}