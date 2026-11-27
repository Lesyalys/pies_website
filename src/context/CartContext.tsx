import {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from "react";
import type { GroupedPie, PieSize } from "../hooks/useMenu";
import type { Decoration } from "../types/menu";

export interface CartItem {
  id: string;
  name: string;
  image_url: string;
  weight: string;
  price: number;
  quantity: number;
  decore?: string;
}

interface LastAdded {
  name: string;
  id: number;
}

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  lastAdded: LastAdded | null;

  openCart: () => void;
  closeCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;

  addToCart: (
    pie: GroupedPie,
    size: PieSize,
    decor: Decoration | null,
    price: number
  ) => void;
  removeFromCart: (id: string, weight: string, decore?: string) => void;
  increaseQuantity: (id: string, weight: string, decore?: string) => void;
  decreaseQuantity: (id: string, weight: string, decore?: string) => void;
  clearCart: () => void;
  clearLastAdded: () => void;

  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const matchItem = (
  item: CartItem,
  id: string,
  weight: string,
  decore?: string
) =>
  item.id === id &&
  item.weight === weight &&
  (item.decore || "") === (decore || "");

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<LastAdded | null>(null);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const openCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };
  const closeCheckout = () => setIsCheckoutOpen(false);
  const clearLastAdded = () => setLastAdded(null);

  const addToCart = (
    pie: GroupedPie,
    size: PieSize,
    decor: Decoration | null,
    price: number
  ) => {
    const weight = String(size.KG);
    const decoreName = decor?.name || "";
    const imageUrl = decor?.image_url || pie.image_url || "";

    setCart((prev) => {
      const existing = prev.find((item) =>
        matchItem(item, pie.id, weight, decoreName)
      );
      if (existing) {
        return prev.map((item) =>
          matchItem(item, pie.id, weight, decoreName)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: pie.id,
          name: pie.product_name,
          image_url: imageUrl,
          weight,
          price,
          quantity: 1,
          decore: decoreName,
        },
      ];
    });

    setLastAdded({ name: pie.product_name, id: Date.now() });
  };

  const removeFromCart = (id: string, weight: string, decore?: string) => {
    setCart((prev) =>
      prev.filter((item) => !matchItem(item, id, weight, decore))
    );
  };

  const increaseQuantity = (id: string, weight: string, decore?: string) => {
    setCart((prev) =>
      prev.map((item) =>
        matchItem(item, id, weight, decore)
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id: string, weight: string, decore?: string) => {
    setCart((prev) =>
      prev
        .map((item) =>
          matchItem(item, id, weight, decore) && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(
          (item) =>
            !(matchItem(item, id, weight, decore) && item.quantity === 0)
        )
    );
  };

  const clearCart = () => setCart([]);

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const totalPrice = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
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