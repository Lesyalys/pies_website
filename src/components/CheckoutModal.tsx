import { useState } from "react";
import { useCart } from "../context/CartContext";
import { SETTINGS } from "../config/settings";
import { useOrderDeadline } from "../hooks/useOrderDeadline";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal = ({ isOpen, onClose }: Props) => {
  const { cart, totalPrice, closeCart } = useCart();
  const { isTodayAvailable, nextAvailableDate } = useOrderDeadline();

  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">(
    "delivery",
  );
  const [selectedZone, setSelectedZone] = useState<string>("");
  const [address, setAddress] = useState("");

  if (!isOpen) return null;

  // Пересчет стоимости
  const zone = SETTINGS.deliveryZones.find((z) => z.id === selectedZone);
  const deliveryCost = deliveryType === "delivery" && zone ? zone.price : 0;
  const pickupDiscountAmount =
    deliveryType === "pickup"
      ? Math.round(totalPrice * SETTINGS.pickupDiscount)
      : 0;
  const finalPrice = totalPrice + deliveryCost - pickupDiscountAmount;

  return (
    <div className="checkout-overlay">
      <div className="checkout-modal">
        <button className="checkout-modal__close" onClick={onClose}>
          ×
        </button>
        <h2 className="checkout-modal__title">Оформление заказа</h2>

        {/* Дата получения */}
        <div className="checkout-field">
          <label className="checkout-label">Дата получения</label>
          <div className="checkout-date-info">
            {isTodayAvailable
              ? "Доступно на сегодня"
              : `Доступно с ${nextAvailableDate.toLocaleDateString("ru-RU")}`}
          </div>
        </div>

        {/* Выбор типа получения */}
        <div className="checkout-field">
          <label className="checkout-label">Способ получения</label>
          <div className="checkout-toggle">
            <button
              className={`checkout-toggle__btn ${deliveryType === "delivery" ? "active" : ""}`}
              onClick={() => setDeliveryType("delivery")}
            >
              Доставка
            </button>
            <button
              className={`checkout-toggle__btn ${deliveryType === "pickup" ? "active" : ""}`}
              onClick={() => setDeliveryType("pickup")}
            >
              Самовывоз (-10%)
            </button>
          </div>
        </div>

        {/* Условия для доставки */}
        {deliveryType === "delivery" && (
          <>
            <div className="checkout-field">
              <label className="checkout-label">Адрес доставки</label>
              <input
                type="text"
                className="checkout-input"
                placeholder="Улица, дом, квартира"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="checkout-field">
              <label className="checkout-label">Район доставки</label>
              <select
                className="checkout-select"
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
              >
                <option value="">Выберите район</option>
                {SETTINGS.deliveryZones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name} — {z.price} ₽
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {/* Итог */}
        <div className="checkout-summary">
          <div className="checkout-summary__row">
            <span>Товары:</span>
            <span>{totalPrice} ₽</span>
          </div>
          {deliveryType === "delivery" && zone && (
            <div className="checkout-summary__row">
              <span>Доставка ({zone.name}):</span>
              <span>{zone.price} ₽</span>
            </div>
          )}
          {deliveryType === "pickup" && (
            <div className="checkout-summary__row checkout-summary__row--discount">
              <span>Скидка за самовывоз (10%):</span>
              <span>−{pickupDiscountAmount} ₽</span>
            </div>
          )}
          <div className="checkout-summary__row checkout-summary__row--total">
            <span>Итого:</span>
            <span>{finalPrice} ₽</span>
          </div>
        </div>

        {/* Кнопка оплаты */}
        <button
          className="btn btn-primary checkout-submit"
          disabled={!isTodayAvailable && deliveryType === "delivery" && !zone}
          onClick={() => {
            // TODO: отправка заказа на бэкенд
            console.log({ cart, deliveryType, address, zone, finalPrice });
            onClose();
            closeCart();
          }}
        >
          {isTodayAvailable ? "Оформить заказ" : "Оформить на завтра"}
        </button>
      </div>
    </div>
  );
};
