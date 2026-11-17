import { useState, useMemo } from "react";
import type { Pie, SizeInfo } from "../types/menu";
import { useCart } from "../context/CartContext";

interface Props {
  pie: Pie;
  sizes: Record<string, SizeInfo>;
}

export const ProductCard = ({ pie, sizes }: Props) => {
  const [selectedSize, setSelectedSize] = useState(pie.available_sizes[0]);
  const [imageError, setImageError] = useState(false);
  const { addToCart } = useCart(); // Подключаем хук корзины

  const isStopped = useMemo(() => {
    if (pie.is_stop) return true;
    if (!pie.stop_start || !pie.stop_end) return false;
    const now = new Date();
    return now >= new Date(pie.stop_start) && now <= new Date(pie.stop_end);
  }, [pie]);

  const currentSizeInfo = sizes[selectedSize];
  const currentPrice = Math.round(pie.price_per_kg * currentSizeInfo.kg);

  const handleAddToCart = () => {
    addToCart(pie, selectedSize, currentPrice);
  };

  const showImage = pie.image_url && !imageError;

  return (
    <div className={`product-card ${isStopped ? "product-card--stopped" : ""}`}>
      {/* Верхняя панель */}
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
        </div>
        {isStopped && <span className="product-card__stop-text">В СТОП</span>}
      </div>

      {/* Изображение */}
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
            src={pie.image_url}
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

      {/* Информация */}
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

      {/* Подвал с ценой и кнопкой */}
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
