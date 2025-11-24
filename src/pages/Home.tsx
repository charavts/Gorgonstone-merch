import { useCart } from '../context/CartContext';
import { Product } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

// Fallback products in case backend is not available
const fallbackProducts: Product[] = [
  {
    id: '1',
    name: 'Black T-shirt Split Stone Face',
    price: 28,
    image: 'https://raw.githubusercontent.com/charavts/Gorgonstone-merch/main/src/public/Black%20T-shirt%20Split%20Stone%20Face.png',
    stripeUrl: 'https://buy.stripe.com/test_fZu14p84Vd7Oeyk3Of00004'
  },
  {
    id: '2',
    name: 'Medusa Mask T-shirt',
    price: 28,
    image: 'https://raw.githubusercontent.com/charavts/Gorgonstone-merch/main/src/public/Medusa%20Mask%20T-shirt%20White.png',
    stripeUrl: 'https://buy.stripe.com/28E8wQ3yl8hF5476ob2Nq02'
  },
  {
    id: '5',
    name: 'Gorgonstone Sweatshirt',
    price: 36,
    image: 'https://raw.githubusercontent.com/charavts/Gorgonstone-merch/main/src/public/High-Quality%20Cotton%20Sweatshirt%20Black.png',
    stripeUrl: 'https://buy.stripe.com/fZu7sMfh37dBdAD8wj2Nq03'
  },
  {
    id: '3',
    name: 'Ammon Horns Medusa Hoodie',
    price: 40,
    image: 'https://raw.githubusercontent.com/charavts/Gorgonstone-merch/main/src/public/High-Quality%20Cotton%20Hoodie%20Black.png',
    stripeUrl: 'https://buy.stripe.com/3cIaEYecZapN7cf9An2Nq00',
    colors: ['Black', 'White'],
    imageVariants: {
      'Black': 'https://raw.githubusercontent.com/charavts/Gorgonstone-merch/main/src/public/High-Quality%20Cotton%20Hoodie%20Black.png',
      'White': 'https://raw.githubusercontent.com/charavts/Gorgonstone-merch/main/src/public/High-Quality%20Cotton%20Hoodie%20White.png'
    }
  }
];

export default function Home() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>(fallbackProducts); // Initialize with fallback products
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      console.log('Loading products from:', `https://${projectId}.supabase.co/functions/v1/make-server-deab0cbd/products`);
      
      // First, try to get products from public endpoint (no auth required)
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
        
        // If no products exist, initialize them
        if (fetchedProducts.length === 0) {
          console.log('No products found, initializing...');
          await initializeProducts();
        } else {
          console.log('Setting products:', fetchedProducts);
          setProducts(fetchedProducts);
        }
      } else {
        console.error('Response not OK. Status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        // Use fallback products if endpoint fails
        console.log('Using fallback products');
        setProducts(fallbackProducts);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      // Fallback to hardcoded products if backend fails
      console.log('Using fallback products due to error');
      setProducts(fallbackProducts);
    } finally {
      setLoading(false);
    }
  };

  const initializeProducts = async () => {
    try {
      console.log('Initializing products from backend...');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-deab0cbd/init-products`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      console.log('Init products response status:', response.status);
      const responseText = await response.text();
      console.log('Init products response:', responseText);

      if (response.ok) {
        const data = JSON.parse(responseText);
        console.log('Products initialized successfully:', data);
        setProducts(data.products || []);
      } else {
        console.error('Failed to initialize products. Status:', response.status, 'Response:', responseText);
        setProducts(fallbackProducts);
      }
    } catch (error) {
      console.error('Error initializing products:', error);
      setProducts(fallbackProducts);
    }
  };

  return (
    <main className="pt-24 pb-40 px-5">{/* Increased bottom padding from pb-20 to pb-40 for much larger space */}
      {/* Logo Section */}
      <div className="mb-12">
        <div className="py-0">
          <div className="max-w-[320px] mx-auto px-5 flex justify-center">
            <ImageWithFallback
              src="https://raw.githubusercontent.com/charavts/Gorgonstone-merch/main/src/public/logo.png"
              alt="Gorgonstone Logo"
              className="w-[300px] max-w-[80vw] h-auto opacity-90"
            />
          </div>
        </div>
      </div>

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