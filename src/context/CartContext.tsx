import { createContext, useContext, useState, ReactNode } from 'react';

export type Size = 'Small' | 'Medium' | 'Large';
export type Color = 'Black' | 'White';

export interface Product {
  id: string;
  name: string;
  nameEl?: string; // Greek name
  price: number;
  image: string;
  stripeUrl: string;
  colors?: Color[];
  imageVariants?: Record<Color, string>;
  // Product details for single page
  material?: {
    en: string;
    el: string;
  };
  description?: {
    en: string;
    el: string;
  };
  care?: {
    en: string[];
    el: string[];
  };
  features?: {
    en: string[];
    el: string[];
  };
}

interface CartItem extends Product {
  quantity: number;
  size: Size;
  color?: Color;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, size: Size, color?: Color) => void;
  removeFromCart: (productId: string, size: Size, color?: Color) => void;
  updateQuantity: (productId: string, size: Size, quantity: number, color?: Color) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, size: Size, color?: Color) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.id === product.id && item.size === size && item.color === color
      );
      
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id && item.size === size && item.color === color
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prevItems, { ...product, quantity: 1, size, color }];
    });
  };

  const removeFromCart = (productId: string, size: Size, color?: Color) => {
    setCartItems((prevItems) => 
      prevItems.filter((item) => !(item.id === productId && item.size === size && item.color === color))
    );
  };

  const updateQuantity = (productId: string, size: Size, quantity: number, color?: Color) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId && item.size === size && item.color === color ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}