import { useCart } from '../context/CartContext';
import { Product } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const products: Product[] = [
  {
    id: '1',
    name: 'Black T-shirt Split Stone Face',
    price: 28,
    image: 'https://raw.githubusercontent.com/charavts/Gorgonstone-merch/main/src/public/Black%20T-shirt%20Split%20Stone%20Face.png',
    stripeUrl: 'https://buy.stripe.com/test_fZu14p84Vd7Oeyk3Of00004'
  },
  {
    id: '2',
    name: 'Medusa Mask T-shirt White',
    price: 28,
    image: 'https://raw.githubusercontent.com/charavts/Gorgonstone-merch/main/src/public/Medusa%20Mask%20T-shirt%20White.png',
    stripeUrl: 'https://buy.stripe.com/28E8wQ3yl8hF5476ob2Nq02'
  },
  {
    id: '3',
    name: 'High-Quality Cotton Hoodie Black',
    price: 40,
    image: 'https://raw.githubusercontent.com/charavts/Gorgonstone-merch/main/src/public/High-Quality%20Cotton%20Hoodie%20Black.png',
    stripeUrl: 'https://buy.stripe.com/3cIaEYecZapN7cf9An2Nq00'
  },
  {
    id: '4',
    name: 'High-Quality Cotton Hoodie White',
    price: 40,
    image: 'https://raw.githubusercontent.com/charavts/Gorgonstone-merch/main/src/public/High-Quality%20Cotton%20Hoodie%20White.png',
    stripeUrl: 'https://buy.stripe.com/cNi00k1qd2XlaordQD2Nq01'
  },
  {
    id: '5',
    name: 'High-Quality Cotton Sweatshirt Black',
    price: 36,
    image: 'https://raw.githubusercontent.com/charavts/Gorgonstone-merch/main/src/public/High-Quality%20Cotton%20Sweatshirt%20Black.png',
    stripeUrl: 'https://buy.stripe.com/fZu7sMfh37dBdAD8wj2Nq03'
  }
];

export default function Home() {
  const { addToCart } = useCart();

  return (
    <main className="pt-24 pb-8 px-5">
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

      {/* Products Grid */}
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6 max-w-7xl mx-auto">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={addToCart}
          />
        ))}
      </div>
    </main>
  );
}