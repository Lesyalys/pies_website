import { createContext, useContext, useState, ReactNode, useMemo } from "react";
import type { Pie } from "../types/menu";

export interface CartItem {
  id: string;
  name: string;
  image_url: string;
  weight: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (pie: Pie, weight: string, price: number, decore: string) => void;
  removeFromCart: (id: string, weight: string) => void;
  increaseQuantity: (id: string, weight: string) => void;
  decreaseQuantity: (id: string, weight: string) => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (pie: Pie, weight: string, price: number) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.id === pie.id && item.weight === weight,
      );
      if (existing) {
        return prev.map((item) =>
          item.id === pie.id && item.weight === weight
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...prev,
        {
          id: pie.id,
          name: pie.name,
          image_url: pie.image_url,
          weight,
          price,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (id: string, weight: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.id === id && item.weight === weight)),
    );
  };

  const increaseQuantity = (id: string, weight: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.weight === weight
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  };

  const decreaseQuantity = (id: string, weight: string) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id && item.weight === weight) {
          return item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item;
        }
        return item;
      }),
    );
  };

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  );
  const totalPrice = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
