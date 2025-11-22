import { useCart } from '../context/CartContext';
import { Product } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const products: Product[] = [
  {
    id: '1',
    name: 'Black T-shirt Split Stone Face',
    price: 28,
    image: '/Black-T-shirt Split Stone Face.png',
    stripeUrl: 'https://buy.stripe.com/test_fZu14p84Vd7Oeyk3Of00004'
  },
  {
    id: '2',
    name: 'Medusa Mask T-shirt White',
    price: 28,
    image: '/Medusa Mask T-shirt White.png',
    stripeUrl: 'https://buy.stripe.com/28E8wQ3yl8hF5476ob2Nq02'
  },
  {
    id: '3',
    name: 'High-Quality Cotton Hoodie Black',
    price: 40,
    image: '/High-Quality Cotton Hoodie Black.png',
    stripeUrl: 'https://buy.stripe.com/3cIaEYecZapN7cf9An2Nq00'
  },
  {
    id: '4',
    name: 'High-Quality Cotton Hoodie White',
    price: 40,
    image: '/High-Quality Cotton Hoodie White.png',
    stripeUrl: 'https://buy.stripe.com/cNi00k1qd2XlaordQD2Nq01'
  },
  {
    id: '5',
    name: 'High-Quality Cotton Sweatshirt Black',
    price: 36,
    image: '/High-Quality Cotton Sweatshirt Black.png',
    stripeUrl: 'https://buy.stripe.com/fZu7sMfh37dBdAD8wj2Nq03'
  }
];

export default function Home() {
  const { addToCart } = useCart();

  return (
    <main className="pt-24 pb-8 px-5">
      <div className="flex flex-wrap justify-start gap-6 max-w-7xl mx-auto">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={addToCart}
          />
        ))}
      </div>
      
      {/* Bottom center logo - scrolls with page */}
      <div className="mt-16 mb-8 flex justify-center w-full opacity-80">
        <ImageWithFallback
          src="/logo.png"
          alt="Gorgonstone Logo"
          className="w-[450px] max-w-[90vw] h-auto"
        />
      </div>
    </main>
  );
}