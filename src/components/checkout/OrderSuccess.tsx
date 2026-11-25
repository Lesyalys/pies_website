import { useEffect, useState } from "react";
import type { CartItem } from "../../context/CartContext";

interface OrderDetails {
  items: CartItem[];
  totalPrice: number;
  deliveryType: "delivery" | "pickup";
  dateLabel: string;
  time: string;
  address?: string;
  phone: string;
  paymentMethod: "courier" | "online";
  finalPrice: number;
  deliveryPrice?: number;
  pickupDiscount?: number;
}

interface Props {
  order: OrderDetails;
  onClose: () => void;
}

const AUTO_CLOSE_SECONDS = 5;

export const OrderSuccess = ({ order, onClose }: Props) => {
  const [progress, setProgress] = useState(100);

  // Автоматическое закрытие через 5 секунд
  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(
        0,
        100 - (elapsed / (AUTO_CLOSE_SECONDS * 1000)) * 100,
      );
      setProgress(remaining);
      if (remaining === 0) {
        clearInterval(interval);
        onClose();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onClose]);

  return (
    <div className="order-success-overlay">
      <div className="order-success">
        <div className="order-success__icon">✓</div>
        <h2 className="order-success__title">Спасибо за заказ!</h2>
        <p className="order-success__subtitle">
          Мы уже начали готовить вашу выпечку. Скоро свяжемся с вами для
          подтверждения.
        </p>

        <div className="order-success__details">
          <h3 className="order-success__details-title">Детали заказа</h3>

          <div className="order-success__items">
            {order.items.map((item) => (
              <div
                key={`${item.id}-${item.weight}-${item.decore || ""}`}
                className="order-success__item"
              >
                <span>
                  {item.name} ({item.weight} кг
                  {item.decore ? `, ${item.decore}` : ""}) × {item.quantity}
                </span>
                <span>{item.price * item.quantity} ₽</span>
              </div>
            ))}
          </div>

          <div className="order-success__summary">
            <div className="order-success__row">
              <span>Товары:</span>
              <span>{order.totalPrice} ₽</span>
            </div>
            {order.deliveryType === "delivery" && order.deliveryPrice && (
              <div className="order-success__row">
                <span>Доставка:</span>
                <span>{order.deliveryPrice} ₽</span>
              </div>
            )}
            {order.deliveryType === "pickup" && order.pickupDiscount && (
              <div className="order-success__row order-success__row--discount">
                <span>Скидка за самовывоз:</span>
                <span>−{order.pickupDiscount} ₽</span>
              </div>
            )}
            <div className="order-success__row order-success__row--total">
              <span>Итого:</span>
              <span>{order.finalPrice} ₽</span>
            </div>
          </div>

          <div className="order-success__info">
            <p>
              <strong>Способ:</strong>{" "}
              {order.deliveryType === "delivery" ? "Доставка" : "Самовывоз"}
            </p>
            <p>
              <strong>Дата:</strong> {order.dateLabel}
            </p>
            <p>
              <strong>Время:</strong> {order.time}
            </p>
            {order.deliveryType === "delivery" && order.address && (
              <p>
                <strong>Адрес:</strong> {order.address}
              </p>
            )}
            <p>
              <strong>Телефон:</strong> {order.phone}
            </p>
            <p>
              <strong>Оплата:</strong>{" "}
              {order.paymentMethod === "courier" ? "Курьеру" : "Онлайн"}
            </p>
          </div>

          {order.deliveryType === "delivery" && (
            <div className="order-success__courier">
              🚚 Ожидайте курьера в выбранный интервал — {order.time}
            </div>
          )}
        </div>

        <button
          className="btn btn-primary order-success__close"
          onClick={onClose}
        >
          Закрыть
        </button>

        {/* Прогресс-бар автозакрытия */}
        <div className="order-success__progress">
          <div
            className="order-success__progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
