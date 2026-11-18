import { useCart } from "../context/CartContext";

export const Header = () => {
  const { totalItems, totalPrice, openCart } = useCart();

  return (
    <header className="header">
      <div className="container header__inner">
        <a href="/" className="header__logo">
          <img
            src="/logo.png"
            alt="Логотип Пироговая"
            className="header__logo-img"
          />
          <span>Домашние пироги</span>
        </a>

        <div className="header__info">
          <a href="tel:+79227977166" className="header__phone">
            +7 (922) 797-71-66
          </a>
          <span className="header__schedule">08:00 - 20:00 / Ежедневно</span>
        </div>

        <div className="header__right">
          <nav className="header__nav">
            <a href="#catalog">Каталог</a>
            <a href="#about">О нас</a>
            <a href="#delivery">Доставка</a>
            <a href="#contacts">Контакты</a>
          </nav>
          {/* Открытие корзины ТОЛЬКО по клику */}
          <button className="btn btn-outline header__cart" onClick={openCart}>
            <span style={{ marginRight: "8px" }}>🛒</span>
            {totalItems > 0 ? `${totalItems} • ${totalPrice} ₽` : "Корзина"}
          </button>
        </div>
      </div>
    </header>
  );
};
