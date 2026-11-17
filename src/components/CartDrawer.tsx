import { useState } from "react";
import { useCart } from "../context/CartContext";
import { CheckoutModal } from "./CheckoutModal";

export const CartDrawer = ({ pies, sizes }: { pies: any[]; sizes: any }) => {
  const {
    cart,
    isCartOpen,
    closeCart,
    totalPrice,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    addToCart,
  } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  if (!isCartOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={closeCart}></div>
      <div className="cart-drawer">
        <div className="cart-drawer__header">
          <h2 className="cart-drawer__title">Корзина</h2>
          <button className="cart-drawer__close" onClick={closeCart}>
            ×
          </button>
        </div>

        <div className="cart-drawer__body">
          {cart.length === 0 ? (
            <div className="cart-drawer__empty">Корзина пуста</div>
          ) : (
            cart.map((item) => (
              <div key={`${item.id}-${item.weight}`} className="cart-item">
                {/* ... как раньше */}
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-drawer__total">
              <span>Итого:</span>
              <span className="cart-drawer__total-price">{totalPrice} ₽</span>
            </div>
            <button
              className="btn btn-primary cart-drawer__checkout"
              onClick={() => setShowCheckout(true)}
            >
              Оформить заказ
            </button>
          </div>
        )}
      </div>

      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
      />
    </>
  );
};
