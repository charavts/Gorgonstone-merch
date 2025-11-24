import { products as productList } from '../data/products';
import { useState, useEffect } from 'react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
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
  const [autoFixAttempted, setAutoFixAttempted] = useState(false);
  const [isAutoFixing, setIsAutoFixing] = useState(false);
  
  useEffect(() => {
    loadProducts();
    loadLogo();
  }, []);

  // Auto-fix: Automatically reset products if GitHub URLs are detected (runs once)
  useEffect(() => {
    if (!loading && !autoFixAttempted && products.length > 0) {
      const hasGitHubUrls = products.some(p => p.image && p.image.includes('github.com'));
      
      if (hasGitHubUrls) {
        console.log('🚨 AUTO-FIX: GitHub URLs detected, forcing reset automatically...');
        setAutoFixAttempted(true); // Prevent infinite loop
        setIsAutoFixing(true);
        
        // Automatically call force reset
        fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-deab0cbd/force-reset-products`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
            },
          }
        )
          .then(response => {
            if (response.ok) {
              console.log('✅ AUTO-FIX: Products reset successfully, reloading...');
              // Wait 1 second then reload
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            } else {
              console.error('❌ AUTO-FIX: Failed to reset products');
              setIsAutoFixing(false);
            }
          })
          .catch(error => {
            console.error('❌ AUTO-FIX: Error resetting products:', error);
            setIsAutoFixing(false);
          });
      }
    }
  }, [loading, products, autoFixAttempted]);

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
      
      console.log('Logo fetch response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Site settings data:', data);
        console.log('Logo URL from settings:', data.settings?.logoUrl);
        
        if (data.settings?.logoUrl) {
          console.log('✅ Setting logo URL to:', data.settings.logoUrl);
          setLogoUrl(data.settings.logoUrl);
        } else {
          console.log('⚠️ No logoUrl in settings, using default');
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
      console.log('Loading products from:', `https://${projectId}.supabase.co/functions/v1/make-server-deab0cbd/products`);
      
      // Check if we already did the force reset (using localStorage)
      const forceResetDone = localStorage.getItem('gorgonstone_force_reset_done');
      
      // IMPORTANT: Force reset products FIRST to ensure we have Unsplash images
      // Only do this once (or if not done yet)
      if (!forceResetDone) {
        console.log('🚀 FIRST TIME: Force resetting products to clear any GitHub URLs...');
        const resetResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-deab0cbd/force-reset-products`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
            },
          }
        );
        
        if (resetResponse.ok) {
          const resetData = await resetResponse.json();
          console.log('✅ Force reset successful:', resetData);
          localStorage.setItem('gorgonstone_force_reset_done', 'true');
          
          // Filter out hidden products for public view
          const visibleProducts = (resetData.products || []).filter((p: any) => !p.hidden);
          setProducts(visibleProducts);
          setLoading(false);
          return; // Exit early with the fresh products
        } else {
          console.log('⚠️ Force reset failed, falling back to normal fetch');
        }
      } else {
        console.log('✅ Force reset already done, using normal fetch');
      }
      
      // Normal fetch after first reset or if reset failed
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-deab0cbd/products`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched data:', data);
        const fetchedProducts = data.products || [];
        console.log('Fetched products count:', fetchedProducts.length);
        
        // Double-check for GitHub URLs even after localStorage says it's done
        const hasGitHubUrls = fetchedProducts.some((p: any) => 
          p.image && p.image.includes('github.com')
        );
        
        if (hasGitHubUrls) {
          console.log('⚠️ GitHub URLs still found! Forcing reset again...');
          localStorage.removeItem('gorgonstone_force_reset_done');
          window.location.reload();
          return;
        }
        
        // Filter out hidden products for public view
        const visibleProducts = fetchedProducts.filter((p: any) => !p.hidden);
        console.log('Visible products count:', visibleProducts.length);
        
        setProducts(visibleProducts);
      } else {
        console.error('Response not OK. Status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        // Use fallback products if endpoint fails
        console.log('Using fallback products');
        setProducts(productList);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      // Fallback to hardcoded products if backend fails
      console.log('Using fallback products due to error');
      setProducts(productList);
    } finally {
      setLoading(false);
    }
  };

  const initializeProducts = async () => {
    try {
      console.log('🔧 Force resetting products with new Unsplash images...');
      
      // Use force-reset endpoint instead of init-products for more aggressive fix
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-deab0cbd/force-reset-products`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      console.log('Force reset response status:', response.status);
      const responseText = await response.text();
      console.log('Force reset response:', responseText);

      if (response.ok) {
        const data = JSON.parse(responseText);
        console.log('✅ Products force reset successfully:', data);
        return data.products || [];
      } else {
        console.error('Failed to force reset products. Status:', response.status, 'Response:', responseText);
        return productList;
      }
    } catch (error) {
      console.error('Error force resetting products:', error);
      return productList;
    }
  };

  return (
    <main className="pt-24 pb-40 px-5">{/* Increased bottom padding from pb-20 to pb-40 for much larger space */}
      {/* Logo Section */}
      <div className="mb-12">
        <div className="py-0">
          <div className="max-w-[320px] mx-auto px-5 flex justify-center">
            <ImageWithFallback
              src={logoUrl}
              alt="Gorgonstone Logo"
              className="w-[300px] max-w-[80vw] h-auto opacity-90"
            />
          </div>
        </div>
      </div>

      {/* Debug: Force Reset Button (Click ONCE to fix images) */}
      {products.some(p => p.image && p.image.includes('github.com')) && !isAutoFixing && (
        <div className="max-w-4xl mx-auto mb-8 bg-yellow-500/10 border-2 border-yellow-500/50 rounded-lg p-6">
          <p className="text-yellow-200 mb-3 text-center">
            ⚠️ Old GitHub URLs detected! Click below to fix images:
          </p>
          <button
            onClick={async () => {
              console.log('🔧 Force resetting products...');
              try {
                const response = await fetch(
                  `https://${projectId}.supabase.co/functions/v1/make-server-deab0cbd/force-reset-products`,
                  {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${publicAnonKey}`,
                    },
                  }
                );
                if (response.ok) {
                  console.log('✅ Products reset successfully!');
                  // Reload the page
                  window.location.reload();
                } else {
                  console.error('❌ Failed to reset products');
                }
              } catch (error) {
                console.error('❌ Error resetting products:', error);
              }
            }}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg transition-colors cursor-pointer"
          >
            🔄 Fix Images Now (Click Once)
          </button>
        </div>
      )}

      {/* Auto-Fixing Banner */}
      {isAutoFixing && (
        <div className="max-w-4xl mx-auto mb-8 bg-green-500/10 border-2 border-green-500/50 rounded-lg p-6">
          <div className="flex items-center justify-center gap-3">
            <div className="animate-spin w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full"></div>
            <p className="text-green-200 text-center">
              🔧 Auto-fixing images... Page will reload in a moment...
            </p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center text-white text-xl py-12">
          Φόρτωση προϊόντων...
        </div>
      )}

      {/* Products Grid */}
      {!loading && (
        <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6 max-w-7xl mx-auto">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      )}
    </main>
  );
}