import { useState } from "react";
import { StreetSelector } from "./StreetSelector";

export interface StreetZone {
  zone: "city" | "remote" | "outside";
  price: number;
}

export interface AddressData {
  street: string;
  house: string;
  apartment: string;
  entrance: string;
  intercom: "yes" | "no";
  intercomCode: string;
  zone: StreetZone | null;
  notes: string;
  paymentMethod: "courier" | "online";
}

interface Props {
  onChange: (data: AddressData) => void;
}

export const AddressInput = ({ onChange }: Props) => {
  const [street, setStreet] = useState("");
  const [house, setHouse] = useState("");
  const [apartment, setApartment] = useState("");
  const [entrance, setEntrance] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"courier" | "online">(
    "courier",
  );
  const [zone, setZone] = useState<StreetZone | null>(null);

  const updateParent = (patch: Partial<AddressData>) => {
    onChange({
      street,
      house,
      apartment,
      entrance,
      intercom: "no",
      intercomCode: "",
      zone,
      notes,
      paymentMethod,
      ...patch,
    });
  };

  const handleStreetChange = (
    newStreet: string,
    newZone: StreetZone | null,
  ) => {
    setStreet(newStreet);
    setZone(newZone);
    updateParent({ street: newStreet, zone: newZone });
  };

  return (
    <div className="address-input">
      <div className="address-fields">
        <StreetSelector value={street} onChange={handleStreetChange} />
        <input
          type="text"
          className="checkout-input"
          placeholder="Дом"
          value={house}
          onChange={(e) => {
            setHouse(e.target.value);
            updateParent({ house: e.target.value });
          }}
        />
        <input
          type="text"
          className="checkout-input"
          placeholder="Кв./Офис"
          value={apartment}
          onChange={(e) => {
            setApartment(e.target.value);
            updateParent({ apartment: e.target.value });
          }}
        />
        <input
          type="text"
          className="checkout-input"
          placeholder="Подъезд"
          value={entrance}
          onChange={(e) => {
            setEntrance(e.target.value);
            updateParent({ entrance: e.target.value });
          }}
        />
      </div>

      <div className="intercom-block">
        <label className="checkout-label">Примечания</label>
        <input
          type="text"
          className="checkout-input"
          placeholder="Например: домофон не работает"
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            updateParent({ notes: e.target.value });
          }}
        />
      </div>

      <div className="intercom-block">
        <label className="checkout-label">Способ оплаты</label>
        <div className="payment-methods">
          <button
            type="button"
            className={`payment-methods__btn ${paymentMethod === "courier" ? "active" : ""}`}
            onClick={() => {
              setPaymentMethod("courier");
              updateParent({ paymentMethod: "courier" });
            }}
          >
            Оплата курьеру
          </button>
          <button
            type="button"
            className={`payment-methods__btn ${paymentMethod === "online" ? "active" : ""}`}
            onClick={() => {
              setPaymentMethod("online");
              updateParent({ paymentMethod: "online" });
            }}
          >
            Оплатить онлайн
          </button>
        </div>
      </div>

      {zone && (
        <div className="address-zone-status">
          ✅ Доставка:{" "}
          {zone.zone === "city"
            ? "Город"
            : zone.zone === "remote"
              ? "Удалённый район"
              : "За городом"}{" "}
          — {zone.price} ₽
        </div>
      )}
      {street && !zone && (
        <div className="address-zone-status address-zone-status--error">
          ❌ Улица не найдена. Проверьте написание.
        </div>
      )}
    </div>
  );
};
