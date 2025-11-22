import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Product } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className="w-[300px] flex flex-col items-center justify-between bg-[#6a6562] rounded-lg p-5 shadow-lg transition-transform hover:scale-105">
      <div 
        className="w-full h-[300px] flex items-center justify-center bg-[#56514f] rounded-lg overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-300"
          style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)' }}
        />
      </div>
      
      <h3 className="text-white text-center min-h-[60px] flex items-center justify-center mt-4 px-2">
        {product.name}
      </h3>
      
      <p className="text-white mb-4">
        Price: {product.price}€
      </p>
      
      <button
        onClick={handleAddToCart}
        className="bg-black hover:bg-[#444] text-white px-6 py-3 rounded-lg transition-colors relative"
      >
        {showSuccess ? 'Added to Cart!' : 'Add to Cart'}
      </button>
    </div>
  );
}
