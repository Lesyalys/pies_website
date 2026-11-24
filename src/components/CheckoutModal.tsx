import { useState, useMemo, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { SETTINGS } from "../config/settings";
import { AddressInput } from "./AddressInput";
import type { AddressData } from "./AddressInput";
import {
  getAvailableDates,
  getDeliveryTimeIntervals,
  getPickupTimeIntervals,
  validatePickupTime,
  validateDeliveryTime,
  canOrderToday,
  ORDER_CUTOFF_HOUR,
} from "../utils/time";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal = ({ isOpen, onClose }: Props) => {
  const { cart, totalPrice, closeCart } = useCart();

  const availableDates = useMemo(() => getAvailableDates(), []);
  const isTodayAvailable = useMemo(() => canOrderToday(), []);

  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">(
    "delivery",
  );
  const [selectedDate, setSelectedDate] = useState(
    availableDates[0]?.value || "",
  );

  const [phone, setPhone] = useState("+7 ");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [pickupTime, setPickupTime] = useState("");

  // ← добавлено zone: null
  const [addressData, setAddressData] = useState<AddressData>({
    street: "",
    house: "",
    apartment: "",
    entrance: "",
    intercom: "no",
    intercomCode: "",
    zone: null,
  });

  const [touched, setTouched] = useState({
    phone: false,
    address: false,
    time: false,
  });

  const deliveryIntervals = useMemo(
    () => getDeliveryTimeIntervals(selectedDate),
    [selectedDate],
  );

  const pickupIntervals = useMemo(
    () => getPickupTimeIntervals(selectedDate),
    [selectedDate],
  );

  useEffect(() => {
    setDeliveryTime("");
    setPickupTime("");
    setTouched((t) => ({ ...t, time: false }));
  }, [selectedDate, deliveryType]);

  if (!isOpen) return null;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.startsWith("7") || val.startsWith("8")) val = val.substring(1);
    let formatted = "+7 ";
    if (val.length > 0) formatted += "(" + val.substring(0, 3);
    if (val.length >= 3) formatted += ") " + val.substring(3, 6);
    if (val.length >= 6) formatted += "-" + val.substring(6, 8);
    if (val.length >= 8) formatted += "-" + val.substring(8, 10);
    setPhone(formatted);
    setTouched((t) => ({ ...t, phone: true }));
  };

  // ← безопасный доступ к zone?.price
  const deliveryCost =
    deliveryType === "delivery" && addressData.zone
      ? addressData.zone.price
      : 0;

  const pickupDiscount =
    deliveryType === "pickup"
      ? Math.round(totalPrice * SETTINGS.pickupDiscount)
      : 0;
  const finalPrice = totalPrice + deliveryCost - pickupDiscount;

  const isPhoneValid = phone.replace(/\D/g, "").length === 11;

  const isAddressValid =
    deliveryType === "delivery"
      ? !!addressData.street.trim() &&
        !!addressData.house.trim() &&
        !!addressData.zone
      : true;

  const isTimeValid =
    deliveryType === "delivery"
      ? validateDeliveryTime(deliveryTime, selectedDate)
      : validatePickupTime(pickupTime, selectedDate);

  const isFormValid = isPhoneValid && isAddressValid && isTimeValid;

  return (
    <div className="checkout-overlay">
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="checkout-modal__close"
          onClick={onClose}
          aria-label="Закрыть"
        >
          ×
        </button>
        <h2 className="checkout-modal__title">Оформление заказа</h2>

        {!isTodayAvailable && (
          <div className="deadline-notice">
            ⏰ Заказы на сегодня принимаются до {ORDER_CUTOFF_HOUR}:00.
            Ближайшая доступная дата — завтра.
          </div>
        )}

        {/* 1. Способ получения */}
        <div className="checkout-field">
          <label className="checkout-label">Способ получения</label>
          <div className="checkout-toggle">
            <button
              type="button"
              className={`checkout-toggle__btn ${deliveryType === "delivery" ? "active" : ""}`}
              onClick={() => setDeliveryType("delivery")}
            >
              Доставка
            </button>
            <button
              type="button"
              className={`checkout-toggle__btn ${deliveryType === "pickup" ? "active" : ""}`}
              onClick={() => setDeliveryType("pickup")}
            >
              Самовывоз (-10%)
            </button>
          </div>
        </div>

        {/* 2. Дата */}
        <div className="checkout-field">
          <label className="checkout-label">Дата получения</label>
          <div className="date-grid">
            {availableDates.map((d) => (
              <button
                key={d.value}
                type="button"
                className={`date-grid__btn ${selectedDate === d.value ? "active" : ""}`}
                onClick={() => setSelectedDate(d.value)}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Время доставки */}
        {deliveryType === "delivery" && (
          <div className="checkout-field">
            <label className="checkout-label">Время доставки</label>
            {deliveryIntervals.length > 0 ? (
              <div className="time-grid">
                {deliveryIntervals.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`time-grid__btn ${deliveryTime === t ? "active" : ""}`}
                    onClick={() => {
                      setDeliveryTime(t);
                      setTouched((prev) => ({ ...prev, time: true }));
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            ) : (
              <div className="address-checker__error">
                На эту дату нет доступных интервалов. Выберите другой день.
              </div>
            )}
            {touched.time && !deliveryTime && (
              <span className="field-error">Выберите интервал доставки</span>
            )}
          </div>
        )}

        {/* 4. Время самовывоза */}
        {deliveryType === "pickup" && (
          <div className="checkout-field">
            <label className="checkout-label">
              Время самовывоза (с 8:00 до 20:00)
            </label>
            {pickupIntervals.length > 0 ? (
              <div className="time-grid">
                {pickupIntervals.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`time-grid__btn ${pickupTime === t ? "active" : ""}`}
                    onClick={() => {
                      setPickupTime(t);
                      setTouched((prev) => ({ ...prev, time: true }));
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            ) : (
              <div className="address-checker__error">
                На эту дату нет доступных интервалов. Выберите другой день.
              </div>
            )}
            {touched.time && !pickupTime && (
              <span className="field-error">Выберите интервал самовывоза</span>
            )}
          </div>
        )}

        {/* 5. Телефон */}
        <div className="checkout-field">
          <label className="checkout-label">Контактный телефон</label>
          <input
            type="tel"
            className="checkout-input"
            placeholder="+7 (___) ___-__-__"
            value={phone}
            onChange={handlePhoneChange}
            onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
          />
          {touched.phone && !isPhoneValid && (
            <span className="field-error">
              Введите номер полностью (11 цифр)
            </span>
          )}
        </div>

        {/* 6. Адрес */}
        {deliveryType === "delivery" && (
          <div className="checkout-field">
            <label className="checkout-label">Адрес доставки</label>
            <AddressInput onChange={setAddressData} />
            {touched.address && !isAddressValid && (
              <span className="field-error">
                Укажите улицу, дом и дождитесь определения зоны
              </span>
            )}
          </div>
        )}

        {/* 7. Итоговая сводка */}
        {cart.length > 0 && (
          <div className="checkout-final-card">
            <h3 className="checkout-final-card__title">Ваш заказ</h3>

            <div className="checkout-final-card__items">
              {cart.map((item) => (
                <div key={`${item.id}-${item.weight}`} className="final-item">
                  <span>
                    {item.name} ({item.weight} кг) × {item.quantity}
                  </span>
                  <span>{item.price * item.quantity} ₽</span>
                </div>
              ))}
            </div>

            <div className="checkout-final-card__summary">
              <div className="checkout-summary__row">
                <span>Товары:</span> <span>{totalPrice} ₽</span>
              </div>
              {deliveryType === "delivery" && addressData.zone && (
                <div className="checkout-summary__row">
                  <span>Доставка:</span> <span>{addressData.zone.price} ₽</span>
                </div>
              )}
              {deliveryType === "pickup" && (
                <div className="checkout-summary__row checkout-summary__row--discount">
                  <span>Скидка за самовывоз:</span>{" "}
                  <span>−{pickupDiscount} ₽</span>
                </div>
              )}
              <div className="checkout-summary__row checkout-summary__row--total">
                <span>Итого:</span> <span>{finalPrice} ₽</span>
              </div>
            </div>

            <div className="checkout-final-card__info">
              <p>
                <strong>Способ:</strong>{" "}
                {deliveryType === "delivery" ? "Доставка" : "Самовывоз"}
              </p>
              <p>
                <strong>Дата:</strong>{" "}
                {availableDates.find((d) => d.value === selectedDate)?.label}
              </p>
              {(deliveryTime || pickupTime) && (
                <p>
                  <strong>Время:</strong>{" "}
                  {deliveryType === "delivery" ? deliveryTime : pickupTime}
                </p>
              )}
              {deliveryType === "delivery" && addressData.street && (
                <p>
                  <strong>Адрес:</strong> {addressData.street}, д.{" "}
                  {addressData.house}
                  {addressData.apartment && `, кв. ${addressData.apartment}`}
                  {addressData.entrance && `, подъезд ${addressData.entrance}`}
                  {addressData.intercom === "yes" &&
                    addressData.intercomCode &&
                    `, домофон ${addressData.intercomCode}`}
                </p>
              )}
              {phone.replace(/\D/g, "").length > 5 && (
                <p>
                  <strong>Телефон:</strong> {phone}
                </p>
              )}
            </div>
          </div>
        )}

        {/* 8. Кнопка */}
        <button
          type="button"
          className="btn btn-primary checkout-submit"
          disabled={!isFormValid}
          onClick={() => {
            if (!isFormValid) return;
            console.log({
              cart,
              deliveryType,
              selectedDate,
              time: deliveryType === "delivery" ? deliveryTime : pickupTime,
              address: addressData,
              phone,
              finalPrice,
            });
            onClose();
            closeCart();
          }}
        >
          {!isFormValid ? "Заполните все поля" : "Оформить заказ"}
        </button>
      </div>
    </div>
  );
};
