import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Calendar, CreditCard, MapPin } from 'lucide-react';
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
      const accessToken = await getAccessToken();
      
      if (!accessToken) {
        console.error('No access token available');
        navigate('/login');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-deab0cbd/my-orders`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      } else {
        console.error('Failed to fetch orders:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
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
        <div className="mb-8">
          <h1 className="text-white mb-2">{t('orders.title')}</h1>
          <div className="h-1 w-20 bg-white/50 rounded"></div>
        </div>

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
                <div className="bg-[#444] p-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-white/70 text-sm">{t('orders.orderId')}</p>
                      <p className="text-white font-mono">#{order.orderId.slice(0, 8).toUpperCase()}</p>
                    </div>
                    <div className="flex items-center gap-2 text-white/90">
                      <Calendar size={16} />
                      <span className="text-sm">{formatDate(order.createdAt)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`${getStatusColor(order.status)} text-white px-4 py-2 rounded text-sm`}>
                      {getStatusText(order.status)}
                    </span>
                    <div className="text-right">
                      <p className="text-white/70 text-sm">{t('orders.total')}</p>
                      <p className="text-white">€{(order.total + order.shippingCost).toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4">
                  <h3 className="text-white mb-3">{t('orders.items')}</h3>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 bg-[#444] p-3 rounded">
                        <ImageWithFallback
                          src={item.image}
                          alt={language === 'el' && item.nameEl ? item.nameEl : item.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="text-white">
                            {language === 'el' && item.nameEl ? item.nameEl : item.name}
                          </p>
                          <div className="flex gap-4 text-white/70 text-sm mt-1">
                            <span>{t('cart.size')}: {item.size}</span>
                            {item.color && <span>{t('cart.color')}: {item.color}</span>}
                            <span>{t('cart.quantity')}: {item.quantity}</span>
                          </div>
                        </div>
                        <p className="text-white">€{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Order Details */}
                  <div className="grid md:grid-cols-2 gap-4 mt-6 pt-4 border-t border-white/10">
                    {/* Shipping Address */}
                    <div>
                      <div className="flex items-center gap-2 text-white mb-2">
                        <MapPin size={18} />
                        <h4>{t('orders.shippingAddress')}</h4>
                      </div>
                      <div className="text-white/80 text-sm">
                        <p>{order.shippingAddress.name}</p>
                        <p>{order.shippingAddress.address}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                        <p>{order.shippingAddress.country}</p>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <div className="flex items-center gap-2 text-white mb-2">
                        <CreditCard size={18} />
                        <h4>{t('orders.paymentMethod')}</h4>
                      </div>
                      <p className="text-white/80 text-sm">
                        {t('orders.card')} {order.paymentMethod}
                      </p>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex justify-end">
                      <div className="space-y-2 text-right">
                        <div className="flex justify-between gap-8 text-white/80">
                          <span>{t('cart.total')}:</span>
                          <span>€{order.total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between gap-8 text-white/80">
                          <span>Shipping:</span>
                          <span>€{order.shippingCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between gap-8 text-white pt-2 border-t border-white/10">
                          <span>{t('orders.total')}:</span>
                          <span>€{(order.total + order.shippingCost).toFixed(2)}</span>
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
