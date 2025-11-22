import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Product, Size } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, size: Size) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedSize, setSelectedSize] = useState<Size>('Medium');

  const handleAddToCart = () => {
    onAddToCart(product, selectedSize);
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
      
      {/* Size Selection */}
      <div className="mb-4 w-full">
        <label className="text-white text-sm mb-2 block text-center">Size:</label>
        <div className="flex gap-2 justify-center">
          {(['Small', 'Medium', 'Large'] as Size[]).map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-4 py-2 rounded transition-colors ${
                selectedSize === size
                  ? 'bg-black text-white'
                  : 'bg-[#56514f] text-white/70 hover:bg-[#444] hover:text-white'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
      
      <button
        onClick={handleAddToCart}
        className="bg-black hover:bg-[#444] text-white px-6 py-3 rounded-lg transition-colors relative"
      >
        {showSuccess ? 'Added to Cart!' : 'Add to Cart'}
      </button>
    </div>
  );
}