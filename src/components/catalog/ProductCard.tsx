import { useState, useMemo } from "react";
import type { Pie, SizeInfo } from "../../types/menu";
import { useCart } from "../../context/CartContext";

interface Props {
  pie: Pie;
  sizes: Record<string, SizeInfo>;
}

export const ProductCard = ({ pie, sizes }: Props) => {
  const [selectedSize, setSelectedSize] = useState(pie.available_sizes[0]);
  const [decore, setDecore] = useState("");
  const [imageError, setImageError] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const { addToCart } = useCart();

  const isStopped = useMemo(() => {
    if (pie.is_stop) return true;
    if (!pie.stop_start || !pie.stop_end) return false;
    const now = new Date();
    return now >= new Date(pie.stop_start) && now <= new Date(pie.stop_end);
  }, [pie]);

  const currentSizeInfo = sizes[selectedSize];
  const currentPrice = Math.round(pie.price_per_kg * currentSizeInfo.kg);

  const getImageUrl = () => {
    if (decore === "Сливки" && pie.image_url_cream) return pie.image_url_cream;
    if (decore === "Сметана" && pie.image_url_sour_cream)
      return pie.image_url_sour_cream;
    return pie.image_url;
  };

  const finalImage = getImageUrl();

  const handleAddToCart = () => {
    addToCart(pie, selectedSize, currentPrice, decore);
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 300);
  };

  const showImage = finalImage && !imageError;

  return (
    <div
      className={`product-card ${isStopped ? "product-card--stopped" : ""} ${
        isPressed ? "product-card--pressed" : ""
      }`}
    >
      <div className="product-card__header">
        <div className="product-card__select-wrap">
          <select
            className="product-card__select"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            disabled={isStopped}
          >
            {pie.available_sizes.map((sizeKey) => (
              <option key={sizeKey} value={sizeKey}>
                кг ({sizeKey})
              </option>
            ))}
          </select>

          {pie.decore && pie.decore.length > 0 && (
            <select
              className="product-card__select"
              value={decore}
              onChange={(e) => {
                setDecore(e.target.value);
                setImageError(false);
              }}
            >
              <option value="">Без декора</option>
              {pie.decore.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          )}
        </div>
        {isStopped && (
          <span className="product-card__stop-text">Временно не готовится</span>
        )}
      </div>

      <div className="product-card__image-wrap">
        <div className="product-card__badges">
          <span className="product-card__badge">
            {currentSizeInfo.diameter_cm_min}–{currentSizeInfo.diameter_cm_max}{" "}
            см
          </span>
          <span className="product-card__badge">
            {currentSizeInfo.persons_min}–{currentSizeInfo.persons_max} чел
          </span>
        </div>

        {showImage ? (
          <img
            src={finalImage}
            alt={pie.name}
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
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" />
              <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </div>
        )}
      </div>

      <div className="product-card__info">
        <h3 className="product-card__title">{pie.name}</h3>
        <p className="product-card__ingredients">
          <span className="product-card__label">Тесто:</span> слоёно-песочное
        </p>
        <p className="product-card__ingredients">
          <span className="product-card__label">Состав:</span>{" "}
          {pie.ingredients.join(", ")}
        </p>
      </div>

      <div className="product-card__footer">
        <div className="product-card__price-block">
          <span className="product-card__footer-label">СТОИМОСТЬ</span>
          <span className="product-card__footer-price">{currentPrice} ₽</span>
        </div>
        <button
          className="btn btn-primary product-card__add-btn"
          onClick={handleAddToCart}
          disabled={isStopped}
        >
          В корзину
        </button>
      </div>
    </div>
  );
};
