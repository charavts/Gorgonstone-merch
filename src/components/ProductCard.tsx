import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Product, Size } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, size: Size) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedSize, setSelectedSize] = useState<Size>('Medium');
  const { t } = useLanguage();

  const handleAddToCart = () => {
    onAddToCart(product, selectedSize);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className="w-full max-w-[300px] sm:w-[300px] flex flex-col items-center justify-between bg-[#56514f] rounded-lg p-4 sm:p-5 shadow-lg transition-transform hover:scale-105">
      <div 
        className="w-full h-[280px] sm:h-[300px] flex items-center justify-center bg-[#6a6562] rounded-lg overflow-hidden"
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
      
      <h3 className="text-white text-center min-h-[60px] flex items-center justify-center mt-3 sm:mt-4 px-2">
        {product.name}
      </h3>
      
      <p className="text-white mb-3 sm:mb-4">
        Price: {product.price}€
      </p>
      
      {/* Size Selection */}
      <div className="mb-3 sm:mb-4 w-full">
        <label className="text-white text-sm mb-2 block text-center">{t('home.sizeLabel')}</label>
        <div className="flex gap-2 justify-center">
          {(['Small', 'Medium', 'Large'] as Size[]).map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-3 sm:px-4 py-2 rounded transition-colors text-sm cursor-pointer ${
                selectedSize === size
                  ? 'bg-black text-white'
                  : 'bg-[#6a6562] text-white/70 hover:bg-[#777] hover:text-white'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
      
      <button
        onClick={handleAddToCart}
        className="bg-black hover:bg-[#444] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-colors relative text-sm sm:text-base cursor-pointer"
      >
        {showSuccess ? `${t('home.addToCart')}!` : t('home.addToCart')}
      </button>
    </div>
  );
}