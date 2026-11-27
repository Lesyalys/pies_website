import { useCart } from "../../context/CartContext";
import { useMenu } from "../../hooks/useMenu";

export const CartDrawer = () => {
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

  const { groupedPies } = useMenu();

  if (!isCartOpen) return null;

  const recommendations = groupedPies
    .filter((pie) => !cart.some((item) => item.id === pie.id))
    .slice(0, 2);

  const handleRecommendationAdd = (pie: (typeof groupedPies)[number]) => {
    const size = pie.sizes[0];
    const decor =
      size.decorations.find((d) => d.is_default) ||
      size.decorations[0] ||
      null;
    const price = size.price + (decor?.price_delta || 0);
    addToCart(pie, size, decor, price);
  };

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
              {cart.map((item) => {
                const key = `${item.id}-${item.weight}-${item.decore || ""}`;
                return (
                  <div key={key} className="cart-item">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="cart-item__image"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                    ) : (
                      <div className="cart-item__image cart-item__image--empty" />
                    )}
                    <div className="cart-item__info">
                      <div className="cart-item__title">{item.name}</div>
                      <div className="cart-item__weight">
                        Вес: {item.weight} кг
                        {item.decore && ` · ${item.decore}`}
                      </div>
                      <div className="cart-item__price">
                        {item.price} ₽ × {item.quantity} ={" "}
                        {item.price * item.quantity} ₽
                      </div>
                    </div>
                    <div className="cart-item__controls">
                      <div className="cart-item__quantity">
                        <button
                          onClick={() =>
                            decreaseQuantity(item.id, item.weight, item.decore)
                          }
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            increaseQuantity(item.id, item.weight, item.decore)
                          }
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="cart-item__remove"
                        onClick={() =>
                          removeFromCart(item.id, item.weight, item.decore)
                        }
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {cart.length > 0 && recommendations.length > 0 && (
          <div className="cart-drawer__recommendations">
            <h3 className="cart-drawer__reco-title">Рекомендуем добавить</h3>
            <div className="cart-reco-list">
              {recommendations.map((pie) => {
                const size = pie.sizes[0];
                const decor =
                  size.decorations.find((d) => d.is_default) ||
                  size.decorations[0] ||
                  null;
                const price = size.price + (decor?.price_delta || 0);
                return (
                  <div key={pie.id} className="cart-reco-item">
                    {decor?.image_url ? (
                      <img
                        src={decor.image_url}
                        alt={pie.product_name}
                        className="cart-reco-item__image"
                      />
                    ) : (
                      <div className="cart-reco-item__image cart-item__image--empty" />
                    )}
                    <div className="cart-reco-item__info">
                      <div className="cart-reco-item__name">
                        {pie.product_name}
                      </div>
                      <div className="cart-reco-item__price">{price} ₽</div>
                    </div>
                    <button
                      className="cart-reco-item__btn"
                      onClick={() => handleRecommendationAdd(pie)}
                      aria-label="Добавить в корзину"
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