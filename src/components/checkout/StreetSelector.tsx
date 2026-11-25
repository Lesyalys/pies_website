import { useState, useMemo, useRef, useEffect } from "react";
import { streetZones } from "../../config/streetZones";
import type { StreetZone } from "../../types/address";

interface Props {
  value: string;
  onChange: (street: string, zone: StreetZone | null) => void;
}

export const StreetSelector = ({ value, onChange }: Props) => {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const suggestions = useMemo(() => {
    if (!query.trim()) return Object.keys(streetZones).slice(0, 10);
    const q = query.toLowerCase().trim();
    return Object.keys(streetZones)
      .filter((s) => s.toLowerCase().includes(q))
      .slice(0, 10);
  }, [query]);

  const handleSelect = (street: string) => {
    setQuery(street);
    setIsOpen(false);
    onChange(street, streetZones[street] || null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setIsOpen(true);
    if (!val) onChange("", null);
  };

  return (
    <div className="street-selector" ref={wrapperRef}>
      <input
        type="text"
        className="checkout-input"
        placeholder="Начните вводить улицу"
        value={query}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        autoComplete="off"
      />
      {isOpen && suggestions.length > 0 && (
        <ul className="street-selector__list">
          {suggestions.map((s) => (
            <li
              key={s}
              className="street-selector__item"
              onClick={() => handleSelect(s)}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
      {isOpen && suggestions.length === 0 && query.length > 0 && (
        <div className="street-selector__empty">
          Улица не найдена. Проверьте название.
        </div>
      )}
    </div>
  );
};
