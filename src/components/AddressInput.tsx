import { useState } from "react";

export interface AddressData {
    street: string;
    house: string;
    apartment: string;
    entrance: string;
    intercom: "yes" | "no";
    intercomCode: string;
}

interface Props {
    onChange: (data: AddressData) => void;
}

export const AddressInput = ({ onChange }: Props) => {
    const [street, setStreet] = useState("");
    const [house, setHouse] = useState("");
    const [apartment, setApartment] = useState("");
    const [entrance, setEntrance] = useState("");
    const [intercom, setIntercom] = useState<"yes" | "no">("no");
    const [intercomCode, setIntercomCode] = useState("");

    const updateParent = (data: Partial<AddressData>) => {
        onChange({
            street,
            house,
            apartment,
            entrance,
            intercom,
            intercomCode,
            ...data,
        });
    };

    return (
        <div className="address-input">
            <div className="address-fields">
                <input
                    type="text"
                    className="checkout-input"
                    placeholder="Улица"
                    value={street}
                    onChange={(e) => {
                        setStreet(e.target.value);
                        updateParent({ street: e.target.value });
                    }}
                />
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
                <label className="checkout-label">Домофон</label>
                <div className="checkout-toggle">
                    <button
                        type="button"
                        className={`checkout-toggle__btn ${intercom === "yes" ? "active" : ""}`}
                        onClick={() => {
                            setIntercom("yes");
                            updateParent({ intercom: "yes" });
                        }}
                    >
                        Есть
                    </button>
                    <button
                        type="button"
                        className={`checkout-toggle__btn ${intercom === "no" ? "active" : ""}`}
                        onClick={() => {
                            setIntercom("no");
                            updateParent({ intercom: "no" });
                        }}
                    >
                        Нет
                    </button>
                </div>
                {intercom === "yes" && (
                    <input
                        type="text"
                        className="checkout-input"
                        placeholder="Код домофона"
                        value={intercomCode}
                        onChange={(e) => {
                            setIntercomCode(e.target.value);
                            updateParent({ intercomCode: e.target.value });
                        }}
                    />
                )}
            </div>
        </div>
    );
};