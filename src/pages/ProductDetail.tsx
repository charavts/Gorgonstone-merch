import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useCart } from '../context/CartContext';
import { Product, Size, Color } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

// Product details including materials and care instructions
const productDetails: Record<string, {
  material: { en: string; el: string };
  description: { en: string; el: string };
  care: { en: string[]; el: string[] };
  features: { en: string[]; el: string[] };
}> = {
  '1': {
    material: {
      en: '100% Premium Cotton',
      el: '100% Εκλεκτό Βαμβάκι'
    },
    description: {
      en: 'A striking design featuring a split stone face inspired by ancient mythology. Perfect for those who appreciate bold artistic statements.',
      el: 'Εντυπωσιακός σχεδιασμός με διχασμένο πέτρινο πρόσωπο εμπνευσμένο από την αρχαία μυθολογία. Ιδανικό για όσους εκτιμούν τολμηρές καλλιτεχνικές δηλώσεις.'
    },
    care: {
      en: ['Machine wash cold', 'Tumble dry low', 'Do not iron on design', 'Do not bleach'],
      el: ['Πλύσιμο σε κρύο νερό', 'Στέγνωμα σε χαμηλή θερμοκρασία', 'Μην σιδερώνετε το σχέδιο', 'Μην χρησιμοποιείτε χλωρίνη']
    },
    features: {
      en: ['Soft and breathable fabric', 'Durable print quality', 'Comfortable regular fit', 'Pre-shrunk material'],
      el: ['Απαλό και αναπνέον ύφασμα', 'Ανθεκτική ποιότητα εκτύπωσης', 'Άνετη κανονική εφαρμογή', 'Προσυρρικνωμένο υλικό']
    }
  },
  '2': {
    material: {
      en: '100% Premium Cotton',
      el: '100% Εκλεκτό Βαμβάκι'
    },
    description: {
      en: 'Featuring the iconic Medusa mask design, this t-shirt combines ancient mythology with modern streetwear aesthetics.',
      el: 'Με το εμβληματικό σχέδιο της μάσκας της Μέδουσας, αυτό το μπλουζάκι συνδυάζει την αρχαία μυθολογία με τη σύγχρονη αισθητική του δρόμου.'
    },
    care: {
      en: ['Machine wash cold', 'Tumble dry low', 'Do not iron on design', 'Do not bleach'],
      el: ['Πλύσιμο σε κρύ νερό', 'Στέγνωμα σε χαμηλή θερμοκρασα', 'Μην σιδερώνετε το σχέδιο', 'Μην χρησιμοποιείτε χλωρίνη']
    },
    features: {
      en: ['Soft and breathable fabric', 'Durable print quality', 'Comfortable regular fit', 'Pre-shrunk material'],
      el: ['Απαλό και αναπνέον ύφασμα', 'Ανθεκτική ποιότητα εκτύπωσης', 'Άνετη κανονική εφαρμογή', 'Προσυρρικνωμένο υλικό']
    }
  },
  '3': {
    material: {
      en: '80% Cotton, 20% Polyester',
      el: '80% Βαμβάκι, 20% Πολυεστέρας'
    },
    description: {
      en: 'Premium quality hoodie with exceptional comfort and warmth. Features a unique mythological design that stands out.',
      el: 'Φούτερ υψηλής ποιότητας με εξαιρετική άνεση και ζεστασιά. Διαθέτει μοναδικό μυθολογικό σχέδιο που ξεχωρίζει.'
    },
    care: {
      en: ['Machine wash cold', 'Tumble dry low', 'Do not iron on design', 'Do not bleach'],
      el: ['Πλύσιμο σε κρύο νερό', 'Στέγνωμα σε χαμηλή θερμοκρασία', 'Μην σιδερώνετε το σχέδιο', 'Μην χρησιμοποιείτε χλωρίνη']
    },
    features: {
      en: ['Fleece-lined interior', 'Adjustable drawstring hood', 'Kangaroo pocket', 'Ribbed cuffs and hem'],
      el: ['Εσωτερική επένδυση fleece', 'Ρυθμιζόμενη κουκούλα με κορδόνι', 'Τσέπη καγκουρό', 'Λαστιχωτά μανίκια και τελείωμα']
    }
  },
  '5': {
    material: {
      en: '80% Cotton, 20% Polyester',
      el: '80% Βαμβάκι, 20% Πολυεστέρας'
    },
    description: {
      en: 'Classic crewneck sweatshirt with premium cotton blend. Perfect for layering or wearing on its own.',
      el: 'Κλασική μπλούζα με στρογγυλή λαιμόκοψη και εκλεκτό μείγμα βαμβακιού. Ιδανική για συνδυασμούς ή μόνη της.'
    },
    care: {
      en: ['Machine wash cold', 'Tumble dry low', 'Do not iron on design', 'Do not bleach'],
      el: ['Πλύσιμο σε κρύο νερό', 'Στέγνωμα σε χαμηλή θερμοκρασία', 'Μην σιδερώνετε το σχέδιο', 'Μην χρησιμοποιείτε χλωρίνη']
    },
    features: {
      en: ['Soft fleece interior', 'Comfortable crew neck', 'Ribbed cuffs and hem', 'Durable construction'],
      el: ['Απαλό εσωτερικό fleece', 'Άνετη στρογγυλή λαιμόκοψη', 'Λαστιχωτ μανίκια και τελείωμα', 'Ανθεκική ατασκευή']
    }
  }
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { t, language } = useLanguage();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<Size>('Medium');
  const [selectedColor, setSelectedColor] = useState<Color | undefined>();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

  const product = products.find(p => p.id === id);
  
  // Use product details from product object if available, otherwise fallback to hardcoded
  const details = product?.material && product?.description && product?.care && product?.features
    ? {
        material: product.material,
        description: product.description,
        care: product.care,
        features: product.features
      }
    : (id ? productDetails[id] : null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-deab0cbd/products`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const fetchedProducts = data.products || [];
        
        if (fetchedProducts.length === 0) {
          await initializeProducts();
        } else {
          setProducts(fetchedProducts);
        }
      }
    } catch (error) {
      console.error('Error loading products:', error);
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

  // Fallback products with Unsplash placeholder images
  const fallbackProducts: Product[] = [
    {
      id: '1',
      name: 'Black T-shirt Split Stone Face',
      price: 28,
      image: 'https://images.unsplash.com/photo-1711641066085-5236bf7afcd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHQtc2hpcnR8ZW58MXx8fHwxNzYzOTcyNDMzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      stripeUrl: 'https://buy.stripe.com/test_fZu14p84Vd7Oeyk3Of00004'
    },
    {
      id: '2',
      name: 'Medusa Mask T-shirt',
      price: 28,
      image: 'https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHQtc2hpcnR8ZW58MXx8fHwxNzYzOTUwMzI1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      stripeUrl: 'https://buy.stripe.com/28E8wQ3yl8hF5476ob2Nq02'
    },
    {
      id: '5',
      name: 'Gorgonstone Sweatshirt',
      price: 36,
      image: 'https://images.unsplash.com/photo-1614173968962-0e61c5ed196f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHN3ZWF0c2hpcnR8ZW58MXx8fHwxNzYzOTk5OTA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      stripeUrl: 'https://buy.stripe.com/fZu7sMfh37dBdAD8wj2Nq03'
    },
    {
      id: '3',
      name: 'Ammon Horns Medusa Hoodie',
      price: 40,
      image: 'https://images.unsplash.com/photo-1647797819874-f51a8a8fc5c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGhvb2RpZXxlbnwxfHx8fDE3NjM5NTI0NzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      stripeUrl: 'https://buy.stripe.com/3cIaEYecZapN7cf9An2Nq00',
      colors: ['Black', 'White'],
      imageVariants: {
        'Black': 'https://images.unsplash.com/photo-1647797819874-f51a8a8fc5c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGhvb2RpZXxlbnwxfHx8fDE3NjM5NTI0NzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        'White': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
      }
    }
  ];

  useEffect(() => {
    // Set default color if product has colors
    if (product?.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0]);
    }
  }, [product]);

  if (loading) {
    return (
      <div className="pt-24 pb-40 px-5 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-white text-2xl mb-4">
            {language === 'el' ? 'Φόρτωση...' : 'Loading...'}
          </h1>
        </div>
      </div>
    );
  }

  if (!product || !details) {
    return (
      <div className="pt-24 pb-40 px-5 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-white text-2xl mb-4">Product not found</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-black hover:bg-[#444] text-white px-6 py-3 rounded-lg transition-colors cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  // Get the current image based on selected color
  const currentImage = selectedColor && product.imageVariants 
    ? product.imageVariants[selectedColor] 
    : product.image;

  return (
    <main className="pt-24 pb-40 px-5">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{language === 'el' ? 'Πίσω στα Προϊόντα' : 'Back to Products'}</span>
        </button>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div 
            className="w-full aspect-square flex items-center justify-center bg-[#56514f] rounded-lg overflow-hidden shadow-lg"
            onMouseEnter={() => setIsImageHovered(true)}
            onMouseLeave={() => setIsImageHovered(false)}
          >
            <ImageWithFallback
              src={currentImage}
              alt={product.name}
              className="w-full h-full object-contain transition-transform duration-300"
              style={{ transform: isImageHovered ? 'scale(1.1)' : 'scale(1)' }}
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <h1 className="text-white text-3xl mb-4">{product.name}</h1>
            
            <div className="text-white text-2xl mb-6">
              {product.price}€
            </div>

            {/* Material */}
            <div className="mb-6">
              <h3 className="text-white mb-2">
                {language === 'el' ? 'Υλικό' : 'Material'}
              </h3>
              <p className="text-white/80">
                {language === 'el' ? details.material.el : details.material.en}
              </p>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-white mb-2">
                {language === 'el' ? 'Περιγραφή' : 'Description'}
              </h3>
              <p className="text-white/80 leading-relaxed">
                {language === 'el' ? details.description.el : details.description.en}
              </p>
            </div>

            {/* Features */}
            <div className="mb-6">
              <h3 className="text-white mb-3">
                {language === 'el' ? 'Χαρακτηριστικά' : 'Features'}
              </h3>
              <ul className="space-y-2">
                {(language === 'el' ? details.features.el : details.features.en).map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-white/80">
                    <Check className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <label className="text-white mb-3 block">
                  {language === 'el' ? 'Χρώμα' : 'Color'}
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-6 py-3 rounded-lg transition-colors cursor-pointer ${
                        selectedColor === color
                          ? 'bg-black text-white'
                          : 'bg-[#56514f] text-white/70 hover:bg-[#777] hover:text-white'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <label className="text-white">
                  {language === 'el' ? 'Μέγεθος' : 'Size'}
                </label>
                <button
                  onClick={() => setIsSizeChartOpen(!isSizeChartOpen)}
                  className="flex items-center gap-1 text-white/70 hover:text-white text-sm transition-colors cursor-pointer"
                >
                  {t('product.sizeChart')}
                  {isSizeChartOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
              
              {/* Size Chart Table */}
              {isSizeChartOpen && (
                <div className="mb-4 bg-[#56514f] rounded-lg p-4">
                  <p className="text-white/80 text-sm mb-3">{t('product.measurements')}</p>
                  <table className="w-full text-sm text-white/80">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left py-2">{language === 'el' ? 'Μέγεθος' : 'Size'}</th>
                        <th className="text-center py-2">{t('product.chest')}</th>
                        <th className="text-center py-2">{t('product.length')}</th>
                        <th className="text-center py-2">{t('product.shoulders')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/10">
                        <td className="py-2">Small</td>
                        <td className="text-center py-2">96-101</td>
                        <td className="text-center py-2">71</td>
                        <td className="text-center py-2">44</td>
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="py-2">Medium</td>
                        <td className="text-center py-2">102-107</td>
                        <td className="text-center py-2">74</td>
                        <td className="text-center py-2">46</td>
                      </tr>
                      <tr>
                        <td className="py-2">Large</td>
                        <td className="text-center py-2">108-114</td>
                        <td className="text-center py-2">76</td>
                        <td className="text-center py-2">49</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
              
              <div className="flex gap-3">
                {(['Small', 'Medium', 'Large'] as Size[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 rounded-lg transition-colors cursor-pointer ${
                      selectedSize === size
                        ? 'bg-black text-white'
                        : 'bg-[#56514f] text-white/70 hover:bg-[#777] hover:text-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="bg-black hover:bg-[#444] text-white px-8 py-4 rounded-lg transition-colors w-full md:w-auto cursor-pointer"
            >
              {showSuccess 
                ? (language === 'el' ? 'Προστέθηκε στο καλάθι!' : 'Added to cart!') 
                : (language === 'el' ? 'Προσθήκη στο καλάθι' : 'Add to cart')
              }
            </button>

            {/* Care Instructions */}
            <div className="mt-8 pt-8 border-t border-white/20">
              <h3 className="text-white mb-3">
                {language === 'el' ? 'Οδηγίες Φροντίδας' : 'Care Instructions'}
              </h3>
              <ul className="space-y-2">
                {(language === 'el' ? details.care.el : details.care.en).map((instruction, index) => (
                  <li key={index} className="flex items-start gap-2 text-white/80 text-sm">
                    <span className="text-white/50">•</span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}