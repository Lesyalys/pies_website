import {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from "react";
import type { Pie } from "../types/menu";

export interface CartItem {
  id: string;
  name: string;
  image_url: string;
  weight: string;
  price: number;
  quantity: number;
  decore?: string;
}

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  lastAdded: string | null;

  openCart: () => void;
  closeCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;

  addToCart: (pie: Pie, weight: string, price: number, decore: string) => void;
  removeFromCart: (id: string, weight: string) => void;
  increaseQuantity: (id: string, weight: string) => void;
  decreaseQuantity: (id: string, weight: string) => void;
  clearCart: () => void;
  clearLastAdded: () => void;

  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const openCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };
  const closeCheckout = () => setIsCheckoutOpen(false);
  const clearLastAdded = () => setLastAdded(null);

  const addToCart = (
    pie: Pie,
    weight: string,
    price: number,
    decore: string,
  ) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          item.id === pie.id &&
          item.weight === weight &&
          (item.decore || "") === (decore || ""),
      );
      if (existing) {
        return prev.map((item) =>
          item.id === pie.id &&
          item.weight === weight &&
          (item.decore || "") === (decore || "")
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
          decore,
        },
      ];
    });
    setLastAdded(pie.name);
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
      prev.map((item) =>
        item.id === id && item.weight === weight && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    );
  };

  const clearCart = () => setCart([]);

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
        isCheckoutOpen,
        lastAdded,
        openCart,
        closeCart,
        openCheckout,
        closeCheckout,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        clearLastAdded,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
