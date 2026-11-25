import { useCart } from "../../context/CartContext";
import type { Pie, SizeInfo } from "../../types/menu";

interface Props {
  pies: Pie[];
  sizes: Record<string, SizeInfo>;
}

export const CartDrawer = ({ pies, sizes }: Props) => {
  const {
    cart,
    isCartOpen,
    closeCart,
    openCheckout,
    totalItems,
    totalPrice,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    addToCart,
  } = useCart();

  if (!isCartOpen) return null;

  const recommendations = pies
    ? pies.filter((pie) => !cart.some((item) => item.id === pie.id)).slice(0, 2)
    : [];

  return (
    <>
      <div className="cart-overlay" onClick={closeCart} />

      <div className="cart-drawer">
        <div className="cart-drawer__header">
          <h2 className="cart-drawer__title">
            Корзина {totalItems > 0 && <span>({totalItems})</span>}
          </h2>
          <button
            className="cart-drawer__close"
            onClick={closeCart}
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>

        <div className="cart-drawer__body">
          {cart.length === 0 ? (
            <div className="cart-drawer__empty">
              <p>Корзина пока пуста</p>
              <button className="btn btn-primary" onClick={closeCart}>
                Перейти в каталог
              </button>
            </div>
          ) : (
            <div className="cart-drawer__items">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.weight}-${item.decore || ""}`}
                  className="cart-item"
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="cart-item__image"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                  <div className="cart-item__info">
                    <div className="cart-item__title">{item.name}</div>
                    <div className="cart-item__weight">
                      Вес: {item.weight} кг
                      {item.decore && ` · ${item.decore}`}
                    </div>
                    <div className="cart-item__price">{item.price} ₽</div>
                  </div>
                  <div className="cart-item__controls">
                    <div className="cart-item__quantity">
                      <button
                        onClick={() => decreaseQuantity(item.id, item.weight)}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => increaseQuantity(item.id, item.weight)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="cart-item__remove"
                      onClick={() => removeFromCart(item.id, item.weight)}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && recommendations.length > 0 && (
          <div className="cart-drawer__recommendations">
            <h3 className="cart-drawer__reco-title">Рекомендуем добавить</h3>
            <div className="cart-reco-list">
              {recommendations.map((pie) => {
                const sizeKey = pie.available_sizes[0];
                const sizeInfo = sizes[sizeKey];
                const price = Math.round(pie.price_per_kg * sizeInfo.kg);
                return (
                  <div key={pie.id} className="cart-reco-item">
                    <img
                      src={pie.image_url}
                      alt={pie.name}
                      className="cart-reco-item__image"
                    />
                    <div className="cart-reco-item__info">
                      <div className="cart-reco-item__name">{pie.name}</div>
                      <div className="cart-reco-item__price">{price} ₽</div>
                    </div>
                    <button
                      className="cart-reco-item__btn"
                      onClick={() => addToCart(pie, sizeKey, price, "")}
                    >
                      +
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {cart.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-drawer__total">
              <span>Итого ({totalItems} шт.):</span>
              <span className="cart-drawer__total-price">{totalPrice} ₽</span>
            </div>
            <button
              className="btn btn-primary cart-drawer__checkout"
              onClick={openCheckout}
            >
              Оформить заказ
            </button>
          </div>
        )}
      </div>
    </>
  );
};
