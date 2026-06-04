import { products as productList } from '../data/products';
import { useState, useEffect } from 'react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import gorgonstoneLogoImg from '../../imports/gorgonstone_exact_colors_transparent.png';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const { t, language } = useLanguage();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [logoUrl, setLogoUrl] = useState('');
  
  useEffect(() => {
    loadProducts();
    loadLogo();
  }, []);

  const loadLogo = async () => {
    try {
      console.log('🔍 Loading logo from backend...');
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
        if (data.settings?.logoUrl) {
          console.log('�� Setting logo URL to:', data.settings.logoUrl);
          setLogoUrl(data.settings.logoUrl);
        }
      } else {
        console.error('❌ Failed to load logo, status:', response.status);
      }
    } catch (error) {
      console.error('❌ Error loading logo:', error);
    }
  };

  const loadProducts = async () => {
    try {
      console.log('📦 Loading products from backend...');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-deab0cbd/products`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        const fetchedProducts = data.products || [];
        console.log('✅ Fetched products count:', fetchedProducts.length);
        
        // Filter out hidden products for public view
        const visibleProducts = fetchedProducts.filter((p: any) => !p.hidden);
        console.log('👁️ Visible products count:', visibleProducts.length);
        
        setProducts(visibleProducts);
      } else {
        console.error('❌ Response not OK. Status:', response.status);
        setProducts(productList);
      }
    } catch (error) {
      console.error('❌ Error loading products:', error);
      setProducts(productList);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-24 pb-40 px-5">
      {/* Logo Section */}
      <div className="mb-12 text-center">
        <div className="flex justify-center">
          <ImageWithFallback
            src={gorgonstoneLogoImg}
            alt="Gorgonstone Logo"
            className="w-[180px] sm:w-[240px] max-w-[90vw] h-auto"
            style={{ filter: 'brightness(0.75)' }}
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center text-white text-xl py-12">
          {language === 'el' ? 'Φόρτωση προϊόντων...' : 'Loading products...'}
        </div>
      )}

      {/* Products Grid */}
      {!loading && (
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 max-w-7xl mx-auto">
          {products.length === 0 ? (
            <div className="text-center text-white/60 py-12 w-full">
              {language === 'el' ? 'Δεν βρέθηκαν προϊόντα' : 'No products found'}
            </div>
          ) : (
            products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))
          )}
        </div>
      )}
    </main>
  );
}