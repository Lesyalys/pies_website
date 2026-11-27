import { useState, useMemo } from "react";
import type { GroupedPie, PieSize } from "../../hooks/useMenu";
import { useCart } from "../../context/CartContext";

interface Props {
  pie: GroupedPie;
}

export const ProductCard = ({ pie }: Props) => {
  // По умолчанию — 1 кг, если есть; иначе первый
  const defaultSize =
    pie.sizes.find((s) => s.KG === 1) || pie.sizes[0];

  const [selectedSizeId, setSelectedSizeId] = useState(defaultSize.id);
  const selectedSize: PieSize =
    pie.sizes.find((s) => s.id === selectedSizeId) || pie.sizes[0];

  const defaultDecor = useMemo(() => {
    if (selectedSize.decorations.length === 0) return null;
    return (
      selectedSize.decorations.find((d) => d.is_default) ||
      selectedSize.decorations[0]
    );
  }, [selectedSize]);

  const [decoreId, setDecoreId] = useState<number | null>(
    defaultDecor ? defaultDecor.id : null
  );

  const [imageError, setImageError] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const { addToCart } = useCart();

  const selectedDecor =
    selectedSize.decorations.find((d) => d.id === decoreId) || null;

  const finalPrice = selectedSize.price + (selectedDecor?.price_delta || 0);
  const finalImage = selectedDecor?.image_url || pie.image_url || "";
  const showImage = !!finalImage && !imageError;

  const handleSizeChange = (sizeId: string) => {
    setSelectedSizeId(sizeId);
    const newSize = pie.sizes.find((s) => s.id === sizeId);
    if (!newSize) return;
    const newDefault =
      newSize.decorations.find((d) => d.is_default) ||
      newSize.decorations[0] ||
      null;
    setDecoreId(newDefault ? newDefault.id : null);
    setImageError(false);
  };

  const handleAddToCart = () => {
    addToCart(pie, selectedSize, selectedDecor, finalPrice);
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 300);
  };

  return (
    <div className={`product-card ${isPressed ? "product-card--pressed" : ""}`}>
      <div className="product-card__header">
        <div className="product-card__select-wrap">
          <select
            className="product-card__select"
            value={selectedSizeId}
            onChange={(e) => handleSizeChange(e.target.value)}
          >
            {pie.sizes.map((s) => (
              <option key={s.id} value={s.id}>
                {s.KG} кг
              </option>
            ))}
          </select>

          {selectedSize.decorations.length > 0 && (
            <select
              className="product-card__select"
              value={decoreId ?? ""}
              onChange={(e) => {
                setDecoreId(Number(e.target.value));
                setImageError(false);
              }}
            >
              {selectedSize.decorations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                  {d.price_delta > 0 ? ` (+${d.price_delta} ₽)` : ""}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="product-card__image-wrap">
        {showImage ? (
          <img
            src={finalImage}
            alt={pie.product_name}
            className="product-card__image"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="product-card__image-placeholder">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" />
              <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </div>
        )}
      </div>

      <div className="product-card__info">
        <h3 className="product-card__title">{pie.product_name}</h3>
        <p className="product-card__ingredients">
          <span className="product-card__label">Состав:</span>{" "}
          {pie.ingredients.join(", ")}
        </p>
      </div>

      <div className="product-card__footer">
        <div className="product-card__price-block">
          <span className="product-card__footer-label">СТОИМОСТЬ</span>
          <span className="product-card__footer-price">{finalPrice} ₽</span>
        </div>
        <button
          className="btn btn-primary product-card__add-btn"
          onClick={handleAddToCart}
        >
          В корзину
        </button>
      </div>
    </div>
  );
};